import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js";

// In-Memory map to store live answers and proctoring data
const activeAttempts = new Map();

// 1. Start Quiz (Ab attempts limit aur previous pass status check hoga)
export const handleStartQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user._id.toString();

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        // Check if user already passed or exceeded attempts limit
        const previousResults = await QuizResult.find({ user: userId, quiz: quizId });
        const attemptsUsed = previousResults.length;
        const alreadyPassed = previousResults.some(r => r.percentage >= quiz.passingScore);

        if (alreadyPassed) {
            return res.status(400).json({ message: "You have already passed this quiz!" });
        }

        if (attemptsUsed >= quiz.attemptsAllowed) {
            return res.status(400).json({ message: "Maximum attempts allowed reached." });
        }

        const questions = await Question.find({ quiz: quizId }).select("-correctAnswer");
        const attemptId = `${userId}_${quizId}_${Date.now()}`; // Unique attempt session

        activeAttempts.set(attemptId, {
            userId,
            quizId: quiz._id,
            passingScore: quiz.passingScore,
            answers: {},
            tabSwitches: 0,
            fullScreenExits: 0,
            startedAt: new Date(),
        });

        res.json({
            attemptId, // Frontend ko attemptId bhejna zaroori hai
            quiz: { ...quiz.toObject(), _id: attemptId, originalQuizId: quiz._id },
            questions,
            expiresAt: new Date(Date.now() + (quiz.timeLimit || 10) * 60 * 1000),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to start quiz", error: error.message });
    }
};

// 2. Save Live Answer
export const handleSaveAnswer = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { questionId, selectedAnswer } = req.body;

        const attempt = activeAttempts.get(attemptId);
        if (attempt) {
            attempt.answers[questionId] = selectedAnswer;
        }

        res.json({ success: true, message: "Answer saved" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save answer", error: error.message });
    }
};

// 3. Track Anti-Cheat Violations (Violation par strict failure handling)
export const handleLogViolation = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { type } = req.body; // 'tab_switch' | 'fullscreen_exit'

        let attempt = activeAttempts.get(attemptId);
        if (!attempt) {
            return res.status(404).json({ message: "Active attempt session not found" });
        }

        if (type === "tab_switch") {
            attempt.tabSwitches = (attempt.tabSwitches || 0) + 1;
        } else if (type === "fullscreen_exit") {
            attempt.fullScreenExits = (attempt.fullScreenExits || 0) + 1;
        }

        activeAttempts.set(attemptId, attempt);

        const autoSubmitted = attempt.tabSwitches >= 3;

        // Agar violations limit cross ho jaye, toh foran automated fail result save karke session clear kar do
        if (autoSubmitted) {
            const questions = await Question.find({ quiz: attempt.quizId });
            const detailedResults = questions.map((q) => ({
                questionId: q._id,
                selectedOption: attempt.answers[q._id.toString()] || null,
                correctAnswer: q.correctAnswer,
                isCorrect: false, // Cheating ki wajah se sab incorrect / fail
            }));

            await QuizResult.create({
                user: attempt.userId,
                quiz: attempt.quizId,
                score: 0,
                totalQuestions: questions.length,
                percentage: 0,
                answers: detailedResults,
                proctoringLogs: {
                    tabSwitches: attempt.tabSwitches,
                    fullScreenExits: attempt.fullScreenExits,
                },
            });

            activeAttempts.delete(attemptId);
        }

        res.json({
            tabSwitches: attempt.tabSwitches,
            fullScreenExits: attempt.fullScreenExits,
            autoSubmitted,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to log violation", error: error.message });
    }
};

// 4. Final Submit Quiz
export const handleFinalSubmit = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.user._id;

        const liveAttempt = activeAttempts.get(attemptId);
        if (!liveAttempt) {
            return res.status(400).json({ message: "Quiz session expired or already submitted." });
        }

        const targetQuizId = liveAttempt.quizId;
        const answers = liveAttempt.answers || {};
        const questions = await Question.find({ quiz: targetQuizId });

        let score = 0;
        const detailedResults = questions.map((q) => {
            const selectedOption = answers[q._id.toString()];
            const isCorrect = selectedOption === q.correctAnswer;
            if (isCorrect) score += 1;

            return {
                questionId: q._id,
                selectedOption: selectedOption || null,
                correctAnswer: q.correctAnswer,
                isCorrect,
            };
        });

        const totalQuestions = questions.length;
        const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

        const quizResult = await QuizResult.create({
            user: userId,
            quiz: targetQuizId,
            score,
            totalQuestions,
            percentage,
            answers: detailedResults,
            proctoringLogs: {
                tabSwitches: liveAttempt.tabSwitches || 0,
                fullScreenExits: liveAttempt.fullScreenExits || 0,
            },
        });

        activeAttempts.delete(attemptId);

        res.status(201).json({
            message: "Quiz submitted successfully",
            result: quizResult,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to submit quiz", error: error.message });
    }
};

// 5. Fetch Specific Quiz Result (Fixed query by quizId)
export const handleFetchResults = async (req, res) => {
    try {
        const { attemptId } = req.params; // ya quizId query param
        const userId = req.user._id;
        const { quizId } = req.query; // Specific quiz result fetch karne ke liye

        let query = { user: userId };
        if (quizId) query.quiz = quizId;

        const result = await QuizResult.findOne(query)
            .populate("quiz", "title passingScore")
            .populate("answers.questionId", "questionText explanation")
            .sort({ createdAt: -1 });

        if (!result) return res.status(404).json({ message: "Result not found" });

        res.json({
            passed: result.percentage >= (result.quiz?.passingScore || 50),
            quizTitle: result.quiz?.title || "Assessment",
            score: result.score,
            totalQuestions: result.totalQuestions,
            percentage: result.percentage,
            passingScore: result.quiz?.passingScore || 50,
            review: result.answers.map((ans) => ({
                questionText: ans.questionId?.questionText || "Question",
                selectedAnswer: ans.selectedOption,
                correctAnswer: ans.correctAnswer,
                isCorrect: ans.isCorrect,
                explanation: ans.questionId?.explanation || "",
            })),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch result", error: error.message });
    }
};