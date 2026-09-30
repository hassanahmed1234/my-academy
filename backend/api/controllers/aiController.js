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
    const { prompt, chatId } = req.body;

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
        aiPoints: 0,
      });
    }

    // AI Call
    const systemInstruction = `... (Aapka System Instruction) ...`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const aiAnswer = response.text;

    // AI Point Deduct
    user.aiPoints -= 1;
    await user.save();

    // --- DB ME CHAT SAVE / UPDATE LOGIC ---
    const activeChatId = chatId || `chat-${Date.now()}`;
    const userMessage = prompt.trim();

    let chatSession = await ChatHistory.findOne({
      user: user._id,
      chatId: activeChatId,
    });

    if (!chatSession) {
      // Auto-generate Title
      const generatedTitle =
        userMessage.length > 25
          ? userMessage.substring(0, 25) + "..."
          : userMessage;

      chatSession = new ChatHistory({
        user: user._id,
        chatId: activeChatId,
        title: generatedTitle,
        messages: [
          { sender: "user", text: userMessage },
          { sender: "ai", text: aiAnswer },
        ],
      });
    } else {
      chatSession.messages.push(
        { sender: "user", text: userMessage },
        { sender: "ai", text: aiAnswer }
      );
      // TTL reset karne ke liye createdAt update kar sakte hain
      chatSession.createdAt = new Date();
    }

    await chatSession.save();

    return res.status(200).json({
      success: true,
      answer: aiAnswer,
      chatId: activeChatId,
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