import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";

// XP Rules Table
const XP_RULES = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 20,
  ASSIGNMENT_SUBMIT: 15,
  EXCELLENT_GRADE: 30,
  COURSE_COMPLETE: 100,
  DAILY_STREAK: 5,
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

export const awardXP = async (userId, actionType, courseId = null) => {
  try {
    // Search query: Specific course ID agar hai toh use karo, nahi toh null check karo
    let query = { userId };
    if (courseId) {
      query.courseId = courseId;
    } else {
      query.courseId = { $exists: false }; // Standalone activities (Quiz, Assignment, General XP)
    }

    let progress = await UserProgress.findOne(query);

    // Agar record nahi mila toh new record create karein
    if (!progress) {
      progress = new UserProgress({
        userId,
        ...(courseId && { courseId }),
        completedLessons: [],
        xp: 0,
        streak: 1,
      });
    }

    // 1. Daily Streak Logic
    const today = new Date().setHours(0, 0, 0, 0);
    const lastActive = new Date(progress.lastActiveDate || Date.now()).setHours(0, 0, 0, 0);
    const diffDays = Math.round((today - lastActive) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      progress.streak += 1;
      progress.xp += XP_RULES.DAILY_STREAK;
    } else if (diffDays > 1) {
      progress.streak = 1; // Streak reset agar din break ho gaya
    }
    progress.lastActiveDate = new Date();

    // 2. Action Type Based XP Allocation
    switch (actionType) {
      case "QUIZ_PASS":
        progress.xp += XP_RULES.QUIZ_PASS;
        progress.quizzesPassed = (progress.quizzesPassed || 0) + 1;
        break;

      case "ASSIGNMENT_SUBMIT":
        progress.xp += XP_RULES.ASSIGNMENT_SUBMIT;
        progress.assignmentsSubmitted = (progress.assignmentsSubmitted || 0) + 1;
        break;

      case "COURSE_COMPLETE":
        progress.xp += XP_RULES.COURSE_COMPLETE;
        progress.isCourseCompleted = true;
        break;

      case "LESSON_COMPLETE":
        progress.xp += XP_RULES.LESSON_COMPLETE;
        break;

      case "EXCELLENT_GRADE":
        progress.xp += XP_RULES.EXCELLENT_GRADE;
        break;

      default:
        break;
    }

    await progress.save();
    return progress;
  } catch (err) {
    console.error("XP Award Error:", err.message);
  }
};