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
Your task is to convert any user prompt or educational topic into an EXHAUSTIVE, COMPLETE structured JSON object for an interactive Visual Learning Canvas UI.

CRITICAL RULES FOR ABSOLUTE COMPLETENESS:
1. EXHAUSTIVE COVERAGE: Do NOT limit or truncate the list of concepts/nodes. If a topic has 12, 15, or 20 items (e.g., "Sunnahs of Wudu", "Pillars of Prayer", "Rules of Tajweed"), you MUST generate a separate node for EVERY SINGLE item. Do NOT skip any point to save space.
2. NO MARKDOWN FORMATTING: Respond ONLY with valid, raw JSON. Do NOT wrap the response in \`\`\`json markdown blocks.
3. DETAILED CONTENT:
   - "definition": Provide exact lexical/technical details.
   - "explanation": Explain the importance, method, or scholarly consensus.
   - "example": Provide a concrete practical example or reference.
   - "activity": Include an engaging 4-option quiz question for every node.

JSON SCHEMA:
{
  "badge": "AI Visual Learning Studio",
  "title_ur": "Urdu/Arabic Title of Topic",
  "subtitle": "Complete & Exhaustive Overview of Topic",
  "header_banner": {
    "title_ar": "Primary Concept Title (Arabic/Main Language)",
    "subtitle": "Summary of All Covered Items"
  },
  "nodes": [
    {
      "id": "node-1",
      "number": "01",
      "title_ar": "Concept Name in Arabic / Native Term",
      "title_en": "English Translation / Title",
      "short_desc": "Rich overview of this specific item (2 lines)",
      "definition": "Detailed definition and primary meaning",
      "explanation": "Complete method or explanation of this specific item",
      "example": "Practical application or textual reference",
      "activity": {
        "question": "A quiz question testing understanding of this specific item?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctIndex": 0
      }
    }
  ]
}
`;

        // Gemini API Call with JSON Enforcement
        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt,
            config: {
                systemInstruction,
                temperature: 0.3,
                maxOutputTokens: 8192,
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