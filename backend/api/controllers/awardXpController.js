import User from "../models/User.js";

const XP_RULES = {
    DAILY_STREAK: 10,
    LESSON_COMPLETE: 15,
    QUIZ_PASS: 50,
    ASSIGNMENT_SUBMIT: 40,
    EXCELLENT_GRADE: 30,
    COURSE_COMPLETE: 200,
};

export const awardXpDirect = async (req, res) => {
    try {
        const userId = req.user._id;
        const { actionType, xpAmount } = req.body; // e.g., actionType: "QUIZ_PASS", xpAmount: 20 (optional)

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let addedXp = 0;

        // 1. Custom XP Amount or Default XP Rule Check
        if (xpAmount && typeof xpAmount === "number" && xpAmount > 0) {
            addedXp = xpAmount;
        } else if (actionType && XP_RULES[actionType.toUpperCase()]) {
            addedXp = XP_RULES[actionType.toUpperCase()];
        } else {
            addedXp = 10; // Default minimum fallback XP
        }

        user.xp = (user.xp || 0) + addedXp;

        // 2. Action based count increments
        const typeUpper = actionType ? actionType.toUpperCase() : "";
        switch (typeUpper) {
            case "QUIZ_PASS":
            case "PERFECT_QUIZ":
                user.quizzesPassed = (user.quizzesPassed || 0) + 1;
                break;

            case "ASSIGNMENT_SUBMIT":
                user.assignmentsSubmitted = (user.assignmentsSubmitted || 0) + 1;
                break;

            case "COURSE_COMPLETE":
                user.coursesCompleted = (user.coursesCompleted || 0) + 1;
                break;

            default:
                break;
        }

        // 3. Streak Logic
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
            user.streak = (user.streak || 0) + 1;
            user.xp += XP_RULES.DAILY_STREAK; // Daily activity streak bonus
        } else if (diffDays > 1) {
            user.streak = 1; // Streak reset agar din skip hua
        } else if (diffDays === 0 && (user.streak === 0 || !user.streak)) {
            user.streak = 1;
        }

        user.lastActiveDate = now;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "XP awarded successfully",
            earnedXp: addedXp,
            user: {
                _id: user._id,
                xp: user.xp,
                streak: user.streak,
                quizzesPassed: user.quizzesPassed,
                assignmentsSubmitted: user.assignmentsSubmitted,
                coursesCompleted: user.coursesCompleted,
            },
        });
    } catch (error) {
        console.error("Direct XP Award Error:", error);
        return res.status(500).json({ message: "Failed to award XP", error: error.message });
    }
};