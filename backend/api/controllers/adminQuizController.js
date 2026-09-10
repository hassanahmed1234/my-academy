import Quiz from "../models/Quiz.js";
import Question from "../models/Question.js";

// 1. Create a New Quiz
export const createQuiz = async (req, res) => {
  try {
    const newQuiz = await Quiz.create(req.body);
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to create quiz", error: error.message });
  }
};

// 2. Update Quiz Details / Publish Status
export const updateQuiz = async (req, res) => {
  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.quizId, req.body, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quiz", error: error.message });
  }
};

// 3. Delete Quiz & All Its Questions
export const deleteQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    await Quiz.findByIdAndDelete(quizId);
    await Question.deleteMany({ quiz: quizId });
    res.json({ message: "Quiz and associated questions deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete quiz", error: error.message });
  }
};

// 4. Add Question to Quiz Bank
export const addQuestion = async (req, res) => {
  try {
    const { quizId, question, options, correctAnswer, explanation } = req.body;
    const newQuestion = await Question.create({
      quiz: quizId,
      question,
      options,
      correctAnswer,
      explanation,
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Failed to add question", error: error.message });
  }
};

// 5. Get All Questions for a Quiz
export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ quiz: req.params.quizId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// 6. Delete a Question
export const deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.questionId);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};