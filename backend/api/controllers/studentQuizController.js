import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js";

// Temporary/In-Memory attempts map (or DB attempt model if used)
// We will store user live selections here
const activeAttempts = new Map();

// 1. Start Quiz
// 1. Start Quiz
export const handleStartQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const userId = req.user._id.toString();

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ message: "Quiz not found" });

        const questions = await Question.find({ quiz: quizId }).select("-correctAnswer");

        const attemptId = `${userId}_${quizId}`;

        // Real quiz Mongo ObjectId standard object key me preserve karein
        activeAttempts.set(attemptId, {
            userId,
            quizId: quiz._id, // Real ObjectId reference
            answers: {},
            tabSwitches: 0,
            fullScreenExits: 0,
            startedAt: new Date(),
        });

        res.json({
            quiz: { ...quiz.toObject(), _id: attemptId, originalQuizId: quiz._id },
            questions,
            expiresAt: new Date(Date.now() + (quiz.timeLimit || 10) * 60 * 1000),
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to start quiz", error: error.message });
    }
};

// 4. Final Submit Quiz
export const handleFinalSubmit = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.user._id;

        const liveAttempt = activeAttempts.get(attemptId);

        // Extract real Quiz ID (Fallback check included)
        const targetQuizId = liveAttempt?.quizId || req.body?.quizId || attemptId.split("_")[1];

        if (!targetQuizId) {
            return res.status(400).json({ message: "Quiz ID not found in attempt scope" });
        }

        const answers = liveAttempt?.answers || req.body?.answers || {};
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

        // QuizResult Document Creation with valid Mongo ObjectId
        const quizResult = await QuizResult.create({
            user: userId,
            quiz: targetQuizId, // Valid Mongo ObjectId assigned
            score,
            totalQuestions,
            percentage,
            answers: detailedResults,
            proctoringLogs: {
                tabSwitches: liveAttempt?.tabSwitches || 0,
                fullScreenExits: liveAttempt?.fullScreenExits || 0,
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

// 2. Auto-save live answer
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

// 3. Track anti-cheat violations
export const handleLogViolation = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { type } = req.body; // 'tab_switch' | 'fullscreen_exit'

        const attempt = activeAttempts.get(attemptId) || { tabSwitches: 0, fullScreenExits: 0 };

        if (type === "tab_switch") {
            attempt.tabSwitches = (attempt.tabSwitches || 0) + 1;
        } else if (type === "fullscreen_exit") {
            attempt.fullScreenExits = (attempt.fullScreenExits || 0) + 1;
        }

        activeAttempts.set(attemptId, attempt);

        const autoSubmitted = attempt.tabSwitches >= 3;

        res.json({
            tabSwitches: attempt.tabSwitches,
            fullScreenExits: attempt.fullScreenExits,
            autoSubmitted,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to log violation", error: error.message });
    }
};



// 5. Fetch Quiz Result
export const handleFetchResults = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const userId = req.user._id;

        const result = await QuizResult.findOne({ user: userId })
            .populate("quiz", "title passingScore")
            .populate("answers.questionId", "questionText explanation")
            .sort({ createdAt: -1 });

        if (!result) return res.status(404).json({ message: "Result not found" });

        // Format for frontend response
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