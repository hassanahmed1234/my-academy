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