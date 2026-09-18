import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";
import QuizAttempt from "../models/QuizAttempt.js";
import User from "../models/User.js"; // <-- Added User Model Import
import { awardXP } from "./leaderboardController.js";

// Helper utility for Fisher-Yates shuffle
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

// 1. Get List of Quizzes for Student
export const getQuizzes = async (req, res) => {
  try {
    const userId = req.user.id;
    const quizzes = await Quiz.find({ isPublished: true }).populate("course", "title");

    const quizzesWithAttempts = await Promise.all(
      quizzes.map(async (quiz) => {
        const attemptsCount = await QuizAttempt.countDocuments({
          user: userId,
          quiz: quiz._id,
          status: { $in: ["submitted", "expired"] },
        });

        const activeAttempt = await QuizAttempt.findOne({
          user: userId,
          quiz: quiz._id,
          status: "in_progress",
        });

        const bestAttempt = await QuizAttempt.findOne({
          user: userId,
          quiz: quiz._id,
          status: "submitted",
        }).sort({ score: -1 });

        return {
          ...quiz.toObject(),
          attemptsUsed: attemptsCount,
          hasActiveAttempt: !!activeAttempt,
          activeAttemptId: activeAttempt?._id || null,
          userPassed: bestAttempt ? bestAttempt.passed : false,
          bestScore: bestAttempt ? bestAttempt.percentage : null,
        };
      })
    );

    res.json(quizzesWithAttempts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
  }
};

// 2. Start Quiz Attempt
export const startQuizAttempt = async (req, res) => {
  try {
    const { quizId } = req.params;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    let activeAttempt = await QuizAttempt.findOne({
      user: userId,
      quiz: quizId,
      status: "in_progress",
    });

    if (activeAttempt) {
      if (new Date() >= new Date(activeAttempt.expiresAt)) {
        activeAttempt.status = "expired";
        await activeAttempt.save();
      } else {
        return res.json({ attempt: activeAttempt, resumed: true });
      }
    }

    const totalCompletedAttempts = await QuizAttempt.countDocuments({
      user: userId,
      quiz: quizId,
      status: { $in: ["submitted", "expired"] },
    });

    if (totalCompletedAttempts >= quiz.attemptsAllowed) {
      return res.status(403).json({ message: "Maximum quiz attempts limit reached." });
    }

    const questionBank = await Question.find({ quiz: quizId });
    if (questionBank.length === 0) {
      return res.status(400).json({ message: "No questions configured for this quiz." });
    }

    const selectedQuestions = shuffleArray(questionBank).slice(
      0,
      Math.min(quiz.questionCount, questionBank.length)
    );

    const randomizedQuestions = selectedQuestions.map((q) => ({
      questionId: q._id,
      questionText: q.question,
      options: shuffleArray(q.options),
      selectedAnswer: null,
    }));

    const now = new Date();
    const expiresAt = new Date(now.getTime() + quiz.timeLimit * 60 * 1000);

    const newAttempt = await QuizAttempt.create({
      user: userId,
      quiz: quizId,
      questions: randomizedQuestions,
      startedAt: now,
      expiresAt,
      status: "in_progress",
    });

    res.status(201).json({ attempt: newAttempt, resumed: false });
  } catch (error) {
    res.status(500).json({ message: "Error starting quiz attempt", error: error.message });
  }
};

// 3. Save Single Answer
export const saveAnswer = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { questionId, selectedAnswer } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt || attempt.status !== "in_progress") {
      return res.status(400).json({ message: "Invalid or expired quiz attempt." });
    }

    if (new Date() >= new Date(attempt.expiresAt)) {
      attempt.status = "expired";
      await attempt.save();
      return res.status(400).json({ message: "Time limit exceeded. Attempt auto-expired." });
    }

    const questionItem = attempt.questions.find(
      (q) => q.questionId.toString() === questionId
    );

    if (questionItem) {
      questionItem.selectedAnswer = selectedAnswer;
      await attempt.save();
    }

    res.json({ success: true, message: "Answer saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error saving answer", error: error.message });
  }
};

// 4. Log Anti-Cheat Violations
export const logViolation = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { type } = req.body;

    const attempt = await QuizAttempt.findById(attemptId);
    if (!attempt || attempt.status !== "in_progress") return res.status(400).json({});

    if (type === "tab_switch") {
      attempt.tabSwitches += 1;
    } else if (type === "fullscreen_exit") {
      attempt.fullscreenExits += 1;
    }

    if (attempt.tabSwitches >= 3) {
      attempt.status = "submitted";
      attempt.submittedAt = new Date();
      await processSubmission(attempt);
      return res.json({ autoSubmitted: true, message: "Too many tab switches. Quiz auto-submitted." });
    }

    await attempt.save();
    res.json({
      tabSwitches: attempt.tabSwitches,
      fullscreenExits: attempt.fullscreenExits,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging violation", error: error.message });
  }
};

// 5. Submit Quiz & Gamification Logic
export const submitQuiz = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await QuizAttempt.findById(attemptId).populate("quiz");
    if (!attempt || attempt.status !== "in_progress") {
      return res.status(400).json({ message: "Attempt already submitted or invalid." });
    }

    attempt.submittedAt = new Date();
    attempt.status = "submitted";

    // Evaluate answers & execute User counter increments
    const result = await processSubmission(attempt);

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      attemptId: attempt._id,
      passed: result.passed,
      isFirstPass: result.isFirstPass,
      score: result.score,
      percentage: result.percentage,
    });
  } catch (error) {
    res.status(500).json({ message: "Error submitting quiz", error: error.message });
  }
};

// Helper: Process Submission and Update Counters
async function processSubmission(attempt) {
  const userId = attempt.user;
  const quiz = await Quiz.findById(attempt.quiz);

  // 1. Check if user has ALREADY passed this quiz previously
  const previousPassedAttempt = await QuizAttempt.findOne({
    user: userId,
    quiz: quiz._id,
    passed: true,
    _id: { $ne: attempt._id },
  });

  const alreadyPassed = !!previousPassedAttempt;

  // 2. Evaluate answers for current attempt
  let correctCount = 0;
  for (let item of attempt.questions) {
    const dbQuestion = await Question.findById(item.questionId);
    if (dbQuestion && item.selectedAnswer === dbQuestion.correctAnswer) {
      correctCount += 1;
    }
  }

  const percentage = Math.round((correctCount / attempt.questions.length) * 100) || 0;
  const passed = percentage >= (quiz.passingScore || 70);

  attempt.score = correctCount;
  attempt.percentage = percentage;
  attempt.passed = passed;
  await attempt.save();

  let isFirstPass = false;

  // 3. Update User stats if Passed for the FIRST TIME
  if (passed && !alreadyPassed) {
    isFirstPass = true;

    // Increment quizzesPassed counter
    await User.findByIdAndUpdate(userId, {
      $inc: { quizzesPassed: 1 },
    });

    // Optional: Award base XP via Leaderboard controller
    if (typeof awardXP === "function") {
      await awardXP(userId, 50, "quiz_pass");
    }

    // 4. Check if all quizzes in the course are passed to update coursesCompleted
    if (quiz.course) {
      const courseQuizzes = await Quiz.find({ course: quiz.course, isPublished: true });
      const courseQuizIds = courseQuizzes.map((q) => q._id);

      // Find all passed attempts by user in this course
      const userPassedQuizzes = await QuizAttempt.distinct("quiz", {
        user: userId,
        quiz: { $in: courseQuizIds },
        passed: true,
      });

      if (userPassedQuizzes.length >= courseQuizIds.length && courseQuizIds.length > 0) {
        // All course quizzes completed! Increment coursesCompleted
        await User.findByIdAndUpdate(userId, {
          $inc: { coursesCompleted: 1 },
        });

        if (typeof awardXP === "function") {
          await awardXP(userId, 200, "course_completion_bonus");
        }
      }
    }
  }

  return { passed, isFirstPass, score: correctCount, percentage };
}

// 6. Get Quiz Result & Detailed Review
export const getQuizResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const attempt = await QuizAttempt.findById(attemptId).populate("quiz");

    if (!attempt) return res.status(404).json({ message: "Attempt not found" });

    const reviewData = await Promise.all(
      attempt.questions.map(async (item) => {
        const dbQ = await Question.findById(item.questionId);
        return {
          questionId: item.questionId,
          questionText: item.questionText,
          options: item.options,
          selectedAnswer: item.selectedAnswer,
          correctAnswer: dbQ ? dbQ.correctAnswer : null,
          explanation: dbQ ? dbQ.explanation : null,
          isCorrect: dbQ ? item.selectedAnswer === dbQ.correctAnswer : false,
        };
      })
    );

    res.json({
      quizTitle: attempt.quiz.title,
      score: attempt.score,
      totalQuestions: attempt.questions.length,
      percentage: attempt.percentage,
      passed: attempt.passed,
      passingScore: attempt.quiz.passingScore,
      submittedAt: attempt.submittedAt,
      tabSwitches: attempt.tabSwitches,
      review: reviewData,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving results", error: error.message });
  }
};