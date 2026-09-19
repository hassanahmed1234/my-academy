import User from "../models/User.js";

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

    // 1. Daily Streak Calculation
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
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
      user.streak = 1; // Streak reset agar din skip hua
    } else if (diffDays === 0 && user.streak === 0) {
      user.streak = 1; // Initial streak set
    }

    user.lastActiveDate = now;

    // 2. Action Based XP & Increments
    if (pointsOverride && typeof pointsOverride === "number") {
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
    return null;
  }
};

export const getLeaderboard = async (req, res) => {
    try {
        const { timeFrame } = req.query; // 'overall' | 'this_week' | 'this_month'

        let matchQuery = { role: "student" }; // Fast filtering for active students
        const now = new Date();

        // Timeframe filtering based on user activity / updates
        if (timeFrame === "this_week") {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            matchQuery.lastActiveDate = { $gte: startOfWeek };
        } else if (timeFrame === "this_month") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchQuery.lastActiveDate = { $gte: startOfMonth };
        }

        // Fetch Top 50 Leaderboard Entries directly from User collection
        const leaderboard = await User.find(matchQuery)
            .select("name email avatar xp streak coursesCompleted quizzesPassed assignmentsSubmitted")
            .sort({ xp: -1 })
            .limit(50)
            .lean();

        // Format leaderboard entries for frontend response
        const formattedLeaderboard = leaderboard.map((item, index) => ({
            _id: item._id,
            rank: index + 1,
            xp: item.xp || 0,
            streak: item.streak || 0,
            coursesCompleted: item.coursesCompleted || 0,
            quizzesPassed: item.quizzesPassed || 0,
            assignmentsSubmitted: item.assignmentsSubmitted || 0,
            student: {
                _id: item._id,
                name: item.name,
                email: item.email,
                avatar: item.avatar || "",
            },
        }));

        // Fetch All Users Sorted by XP to determine logged-in User's Exact Rank
        const allRankings = await User.find(matchQuery)
            .select("_id xp streak coursesCompleted quizzesPassed")
            .sort({ xp: -1 })
            .lean();

        const currentUserIdStr = req.user._id.toString();
        const userRankIndex = allRankings.findIndex(
            (item) => item._id.toString() === currentUserIdStr
        );

        let currentUserStats = null;

        if (userRankIndex !== -1) {
            const userDoc = allRankings[userRankIndex];
            const targetRankIndex = Math.max(0, userRankIndex - 1); // Immediate next rank target
            const targetUser = allRankings[targetRankIndex];

            currentUserStats = {
                rank: userRankIndex + 1,
                xp: userDoc.xp || 0,
                courses: userDoc.coursesCompleted || 0,
                quizzes: userDoc.quizzesPassed || 0,
                streak: userDoc.streak || 0,
                xpToNextRank: targetUser && targetRankIndex !== userRankIndex 
                    ? Math.max(0, (targetUser.xp || 0) - (userDoc.xp || 0) + 10) 
                    : 0,
            };
        } else {
            // Fallback in case logged-in user isn't in matchQuery timeframe filter
            const loggedInUser = await User.findById(req.user._id).lean();
            if (loggedInUser) {
                currentUserStats = {
                    rank: "Unranked",
                    xp: loggedInUser.xp || 0,
                    courses: loggedInUser.coursesCompleted || 0,
                    quizzes: loggedInUser.quizzesPassed || 0,
                    streak: loggedInUser.streak || 0,
                    xpToNextRank: 0,
                };
            }
        }

        res.json({
            leaderboard: formattedLeaderboard,
            currentUserStats,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
    }
};