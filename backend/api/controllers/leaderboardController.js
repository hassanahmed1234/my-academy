import User from "../models/User.js";

// XP Rules Config
const XP_RULES = {
  DAILY_STREAK: 10,
  LESSON_COMPLETE: 15,
  QUIZ_PASS: 50,
  ASSIGNMENT_SUBMIT: 40,
  EXCELLENT_GRADE: 30,
  COURSE_COMPLETE: 200,
};

export const awardXP = async (userId, actionType, pointsOverride = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("XP Award Error: User not found");
      return null;
    }

    // 1. Daily Streak Logic
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Fallback if lastActiveDate doesn't exist on user model yet
    const lastActiveDate = user.lastActiveDate ? new Date(user.lastActiveDate) : new Date();
    const lastActive = new Date(
      lastActiveDate.getFullYear(),
      lastActiveDate.getMonth(),
      lastActiveDate.getDate()
    ).getTime();

    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
      user.xp += XP_RULES.DAILY_STREAK;
    } else if (diffDays > 1) {
      user.streak = 1; // Streak reset agar 1 din se zyada ka gap aaye
    } else if (diffDays === 0 && user.streak === 0) {
      user.streak = 1; // Initial streak set
    }

    user.lastActiveDate = now;

    // 2. Action Type Based XP & Counter Allocation
    if (pointsOverride && typeof pointsOverride === "number") {
      // Manual/Custom XP points override (e.g. awardXP(userId, "QUIZ_PASS", 50))
      user.xp += pointsOverride;
    }

    switch (actionType) {
      case "QUIZ_PASS":
      case "quiz_pass":
        if (!pointsOverride) user.xp += XP_RULES.QUIZ_PASS;
        user.quizzesPassed = (user.quizzesPassed || 0) + 1;
        break;

      case "ASSIGNMENT_SUBMIT":
      case "assignment_submit":
        if (!pointsOverride) user.xp += XP_RULES.ASSIGNMENT_SUBMIT;
        user.assignmentsSubmitted = (user.assignmentsSubmitted || 0) + 1;
        break;

      case "COURSE_COMPLETE":
      case "course_completion_bonus":
        if (!pointsOverride) user.xp += XP_RULES.COURSE_COMPLETE;
        user.coursesCompleted = (user.coursesCompleted || 0) + 1;
        break;

      case "LESSON_COMPLETE":
        if (!pointsOverride) user.xp += XP_RULES.LESSON_COMPLETE;
        break;

      case "EXCELLENT_GRADE":
        if (!pointsOverride) user.xp += XP_RULES.EXCELLENT_GRADE;
        break;

      default:
        break;
    }

    await user.save();
    return user;
  } catch (err) {
    console.error("XP Award Error:", err.message);
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const { timeFrame } = req.query;
    let matchQuery = { role: "student" };
    const now = new Date();

    if (timeFrame === "this_week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchQuery.updatedAt = { $gte: startOfWeek };
    } else if (timeFrame === "this_month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchQuery.updatedAt = { $gte: startOfMonth };
    }

    // Top 50 Students Query
    const leaderboardDocs = await User.find(matchQuery)
      .select("name email avatar xp streak coursesCompleted quizzesPassed assignmentsSubmitted role")
      .sort({ xp: -1 })
      .limit(50)
      .lean();

    const leaderboard = leaderboardDocs.map((user) => ({
      _id: user._id,
      xp: user.xp || 0,
      streak: user.streak || 0,
      coursesCompleted: user.coursesCompleted || 0,
      quizzesPassed: user.quizzesPassed || 0,
      assignmentsSubmitted: user.assignmentsSubmitted || 0,
      student: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || "",
      },
    }));

    // Current User Data & Rank Calculation
    const currentUser = await User.findById(req.user._id).select("xp streak coursesCompleted quizzesPassed").lean();
    let currentUserStats = null;

    if (currentUser) {
      // Calculate rank using count Documents with higher XP
      const higherXpCount = await User.countDocuments({
        ...matchQuery,
        xp: { $gt: currentUser.xp || 0 },
      });

      const userRank = higherXpCount + 1;

      // Fetch immediate higher user to determine xpToNextRank
      const nextRankUser = await User.findOne({
        ...matchQuery,
        xp: { $gt: currentUser.xp || 0 },
      })
        .select("xp")
        .sort({ xp: 1 })
        .lean();

      currentUserStats = {
        rank: userRank,
        xp: currentUser.xp || 0,
        courses: currentUser.coursesCompleted || 0,
        quizzes: currentUser.quizzesPassed || 0,
        streak: currentUser.streak || 0,
        xpToNextRank: nextRankUser ? Math.max(0, nextRankUser.xp - currentUser.xp + 1) : 0,
      };
    }

    return res.status(200).json({
      leaderboard,
      currentUserStats,
    });
  } catch (err) {
    console.error("Leaderboard Error:", err);
    return res.status(500).json({
      message: "Error fetching leaderboard",
      error: err.message,
    });
  }
};
