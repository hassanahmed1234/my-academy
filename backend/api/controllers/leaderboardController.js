import User from "../models/User.js";



export const getLeaderboard = async (req, res) => {
  try {
    const { timeFrame } = req.query; // 'overall' | 'this_week' | 'this_month'

    let matchQuery = { role: "student" }; // Fast filtering for active students

    // Corrected Date calculations without mutating original Date object
    if (timeFrame === "this_week") {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchQuery.lastActiveDate = { $gte: startOfWeek };
    } else if (timeFrame === "this_month") {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      matchQuery.lastActiveDate = { $gte: startOfMonth };
    }

    // Common sorting criteria for consistent ranking
    const sortCriteria = {
      xp: -1,               // 1st Priority: XP Points
      coursesCompleted: -1, // 2nd Priority: Completed Courses
      quizzesPassed: -1,    // 3rd Priority: Quizzes Passed
      streak: -1            // 4th Priority: Streak
    };

    // Fetch Top 50 Leaderboard Entries
    const leaderboard = await User.find(matchQuery)
      .select("name email avatar xp streak coursesCompleted quizzesPassed assignmentsSubmitted")
      .sort(sortCriteria)
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

    // Fetch Logged-in User Data
    const loggedInUser = await User.findById(req.user._id)
      .select("role lastActiveDate xp streak coursesCompleted quizzesPassed")
      .lean();

    let currentUserStats = null;

    if (loggedInUser) {
      // Check if logged-in user matches current timeFrame query filter
      let qualifiesForFilter = loggedInUser.role === "student";
      if (qualifiesForFilter && matchQuery.lastActiveDate) {
        qualifiesForFilter = loggedInUser.lastActiveDate >= matchQuery.lastActiveDate.$gte;
      }

      if (qualifiesForFilter) {
        // Fast & optimized DB level Rank Calculation (No heavy memory array loading)
        const userXP = loggedInUser.xp || 0;
        const userCourses = loggedInUser.coursesCompleted || 0;
        const userQuizzes = loggedInUser.quizzesPassed || 0;
        const userStreak = loggedInUser.streak || 0;

        const usersAhead = await User.countDocuments({
          ...matchQuery,
          $or: [
            { xp: { $gt: userXP } },
            { xp: userXP, coursesCompleted: { $gt: userCourses } },
            { xp: userXP, coursesCompleted: userCourses, quizzesPassed: { $gt: userQuizzes } },
            { xp: userXP, coursesCompleted: userCourses, quizzesPassed: userQuizzes, streak: { $gt: userStreak } },
          ],
        });

        const currentRank = usersAhead + 1;

        // Fetch immediate next target user (person directly above current user)
        let xpToNextRank = 0;
        if (currentRank > 1) {
          const personAbove = await User.findOne({
            ...matchQuery,
            $or: [
              { xp: { $gt: userXP } },
              { xp: userXP, coursesCompleted: { $gt: userCourses } },
              { xp: userXP, coursesCompleted: userCourses, quizzesPassed: { $gt: userQuizzes } },
              { xp: userXP, coursesCompleted: userCourses, quizzesPassed: userQuizzes, streak: { $gt: userStreak } },
            ],
          })
            .sort(sortCriteria)
            .select("xp")
            .lean();

          if (personAbove) {
            xpToNextRank = Math.max(0, (personAbove.xp || 0) - userXP + 10);
          }
        }

        currentUserStats = {
          rank: currentRank,
          xp: userXP,
          courses: userCourses,
          quizzes: userQuizzes,
          streak: userStreak,
          xpToNextRank,
        };
      } else {
        // Fallback: If logged-in user didn't qualify for timeframe match filter
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

    res.status(200).json({
      leaderboard: formattedLeaderboard,
      currentUserStats,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaderboard", error: err.message });
  }
};