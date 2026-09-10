import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizResult from "../models/QuizResult.js"; // Standard result model

// 1. Get/Start Quiz (Fetches Quiz Meta + Questions)
export const handleStartQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    // Fetch questions without revealing correct answer
    const questions = await Question.find({ quiz: quizId }).select("-correctAnswer");

    res.json({
      quiz,
      questions,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to start quiz", error: error.message });
  }
};

// 2. Submit Final Quiz (Evaluates choices, visibility logs, and saves attempt)
export const handleFinalSubmit = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers, visibilityViolations, fullScreenViolations, timeTaken } = req.body;
    const userId = req.user._id;

    // Fetch original questions with correct answers to evaluate
    const questions = await Question.find({ quiz: quizId });

    let score = 0;
    const detailedResults = questions.map((q) => {
      const selectedOption = answers[q._id];
      const isCorrect = selectedOption === q.correctAnswer;
      if (isCorrect) score += 1;

      return {
        questionId: q._id,
        selectedOption,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Save user attempt and anti-cheat telemetry to DB
    const quizResult = await QuizResult.create({
      user: userId,
      quiz: quizId,
      score,
      totalQuestions,
      percentage,
      timeTaken,
      answers: detailedResults,
      proctoringLogs: {
        tabSwitches: visibilityViolations || 0,
        fullScreenExits: fullScreenViolations || 0,
      },
    });

    res.status(201).json({
      message: "Quiz submitted successfully",
      result: quizResult,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit quiz", error: error.message });
  }
};

// 3. Fetch Student Quiz Results
export const handleFetchResults = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user._id;

    const results = await QuizResult.find({ quiz: quizId, user: userId })
      .populate("quiz", "title totalMarks")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz results", error: error.message });
  }
};