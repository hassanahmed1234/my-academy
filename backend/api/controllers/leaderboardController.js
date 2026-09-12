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
        const { timeFrame } = req.query; // 'overall' | 'this_week' | 'this_month'

        let matchQuery = {};
        const now = new Date();

        if (timeFrame === "this_week") {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            matchQuery = { updatedAt: { $gte: startOfWeek } };
        } else if (timeFrame === "this_month") {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            matchQuery = { updatedAt: { $gte: startOfMonth } };
        }

        // Common Pipeline Stage: Grouping User Progress per Student
        const basePipeline = [
            { $match: matchQuery },
            {
                $group: {
                    _id: "$userId",
                    xp: { $sum: "$xp" },
                    streak: { $max: "$streak" },
                    coursesCompleted: {
                        $sum: { $cond: [{ $eq: ["$isCourseCompleted", true] }, 1, 0] },
                    },
                    quizzesPassed: { $sum: "$quizzesPassed" },
                    assignmentsSubmitted: { $sum: "$assignmentsSubmitted" },
                },
            },
            { $sort: { xp: -1 } },
        ];

        // Fetch Top 50 Leaderboard entries with populated User details
        const leaderboard = await UserProgress.aggregate([
            ...basePipeline,
            { $limit: 50 },
            {
                $lookup: {
                    from: "users", // MongoDB collection name for User model
                    localField: "_id",
                    foreignField: "_id",
                    as: "student",
                },
            },
            { $unwind: "$student" },
            {
                $project: {
                    _id: 1,
                    xp: 1,
                    streak: 1,
                    coursesCompleted: 1,
                    quizzesPassed: 1,
                    assignmentsSubmitted: 1,
                    student: {
                        _id: "$student._id",
                        name: "$student.name",
                        email: "$student.email",
                        avatar: "$student.avatar",
                    },
                },
            },
        ]);

        // Calculate All Rankings to identify current user's position
        const allRankings = await UserProgress.aggregate(basePipeline);

        const currentUserIdStr = req.user._id.toString();
        const userRankIndex = allRankings.findIndex(
            (item) => item._id.toString() === currentUserIdStr
        );

        let currentUserStats = null;
        if (userRankIndex !== -1) {
            const userDoc = allRankings[userRankIndex];
            const targetRankIndex = Math.max(0, userRankIndex - 2);
            const targetUser = allRankings[targetRankIndex];

            currentUserStats = {
                rank: userRankIndex + 1,
                xp: userDoc.xp,
                courses: userDoc.coursesCompleted,
                quizzes: userDoc.quizzesPassed,
                streak: userDoc.streak,
                xpToNextRank: targetUser ? Math.max(0, targetUser.xp - userDoc.xp + 10) : 0,
            };
        }

        res.json({
            leaderboard,
            currentUserStats,
        });
    } catch (err) {
        res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
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