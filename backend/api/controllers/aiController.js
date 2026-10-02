import { GoogleGenAI } from "@google/genai";
import User from "../models/User.js";
import ChatHistory from "../models/ChatHistory.js";

// Initialize Gemini API Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Get User's Current AI Points Info
// @route   GET /api/ai/points
// @access  Private (Auth required)
export const getAiPoints = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Auto check & reset daily points if new day
        const currentPoints = await user.checkAndResetAiPoints();

        return res.status(200).json({
            success: true,
            aiPoints: currentPoints,
            lastAiResetDate: user.lastAiResetDate,
        });
    } catch (error) {
        console.error("Error fetching AI points:", error);
        return res.status(500).json({ message: "Server error fetching AI status" });
    }
};

// @desc    Ask AI Assistant & Deduct 1 Daily Point
// @route   POST /api/ai/ask
// @access  Private (Auth required)
export const askAiAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({ message: "Prompt is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check & Reset Daily Points
    await user.checkAndResetAiPoints();

    if (user.aiPoints <= 0) {
      return res.status(403).json({
        success: false,
        message:
          "Aapke aaj ke 10 AI Points khatam ho chuke hain! Kal dubara 10 points milenge.",
        remainingPoints: 0,
      });
    }

    // --- STRICT VISUAL LEARNING CANVAS SYSTEM INSTRUCTION ---
    const systemInstruction = `
    You are an expert Islamic & Educational Visual Learning Architect.
    Your task is to ALWAYS convert any user prompt or educational topic into a strictly formatted JSON object for an interactive Visual Learning Canvas UI.

    CRITICAL RULES:
    1. Respond ONLY with valid, raw JSON. Do NOT include markdown code blocks like \`\`\`json or explanation text.
    2. Structure must adhere STRICTLY to this schema:
    {
      "badge": "AI Visual Learning Studio",
      "title_ur": "Urdu/Arabic Title of Topic",
      "subtitle": "English Title or Subtitle",
      "header_banner": {
        "title_ar": "Main Arabic/Primary Concept Title",
        "subtitle": "English Explanation Banner Title"
      },
      "nodes": [
        {
          "id": "node-1",
          "number": "01",
          "title_ar": "Arabic/Main Concept Name",
          "title_en": "English Translation Name",
          "short_desc": "Short overview of this node (1-2 lines)",
          "definition": "Detailed definition and primary meaning",
          "explanation": "Detailed explanation of this point",
          "example": "Practical real-world example or reference",
          "activity": {
            "question": "A multiple-choice quiz question related to this node?",
            "options": ["Option A", "Option B", "Option C"],
            "correctIndex": 1
          }
        }
      ]
    }
    3. Generate 3 to 4 nodes depending on the topic.
    4. Keep language mix: Arabic for terms, English/Roman Urdu for definitions & questions.
    `;

    // Gemini API Call with JSON Enforcement
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
        responseMimeType: "application/json", // Enforces strict JSON response
      },
    });

    const aiAnswerRaw = response.text;

    // Parse JSON to verify
    let parsedData;
    try {
      parsedData = JSON.parse(aiAnswerRaw);
    } catch (parseErr) {
      parsedData = aiAnswerRaw; // Fallback
    }

    // Deduct AI Point
    user.aiPoints -= 1;
    await user.save();

    return res.status(200).json({
      success: true,
      answer: parsedData,
      remainingPoints: user.aiPoints,
    });
  } catch (error) {
    console.error("Gemini AI API Error:", error);
    return res.status(500).json({
      message: "AI Assistant responds error. Please try again later.",
      error: error.message,
    });
  }
};

// 2. Fetch Daily Recent Chats (Page Reload hone par fetch karne ke liye)
export const getRecentChats = async (req, res) => {
  try {
    const chats = await ChatHistory.find({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .select("chatId title messages createdAt");

    return res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};