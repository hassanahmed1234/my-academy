import React, { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  Sparkles,
  Zap,
  Loader2,
  BookOpen,
  HelpCircle,
  CheckCircle,
  X,
  ArrowDown,
  Search,
  ExternalLink,
  Layers,
  AlertCircle,
} from "lucide-react";

// Default / Initial Demo Visual Canvas Data (Islamic Law Sources Example)
const DEFAULT_CANVAS_DATA = {
  badge: "AI Visual Learning Studio",
  title_ur: "مصادرِ شريعت",
  subtitle: "Sources of Islamic Law",
  header_banner: {
    title_ar: "الأدلة الشرعية",
    subtitle: "Primary Legal Sources",
  },
  nodes: [
    {
      id: "quran",
      number: "01",
      title_ar: "القرآن",
      title_en: "Quran",
      short_desc: "The primary source of divine guidance and Islamic jurisprudence.",
      definition: "The verbatim word of Allah revealed to Prophet Muhammad (PBUH) through Angel Jibril.",
      explanation: "It serves as the foundational legal source from which all fundamental principles of Shariah originate.",
      example: "Commands regarding Salah, Zakat, and ethical guidelines for financial transactions.",
      activity: {
        question: "What is the primary status of the Quran among Shariah sources?",
        options: ["Secondary Source", "Primary Source", "Optional Legal Reference"],
        correctIndex: 1,
      },
    },
    {
      id: "sunnah",
      number: "02",
      title_ar: "السنة",
      title_en: "Sunnah",
      short_desc: "Sayings, practices, and approvals of Prophet Muhammad (PBUH).",
      definition: "The practical implementation and detailed explanation of Quranic principles by the Prophet (PBUH).",
      explanation: "Sunnah elaborates on general Quranic commandments and specifies how rulings are implemented.",
      example: "Detailed procedure and rak'ahs of Salah which are mentioned broadly in the Quran.",
      activity: {
        question: "How does the Sunnah complement the Holy Quran?",
        options: ["It replaces Quranic laws", "It explains and details Quranic rulings", "It is unrelated"],
        correctIndex: 1,
      },
    },
    {
      id: "ijma",
      number: "03",
      title_ar: "الإجماع",
      title_en: "Ijma",
      short_desc: "Consensus of qualified Islamic scholars on a legal ruling.",
      definition: "The unanimous agreement of Muslim jurists (Mujtahidun) of a particular era on a religious matter.",
      explanation: "When a new situation arises that is not explicitly detailed in Quran/Sunnah, scholars reach consensus.",
      example: "Compilation of the Quran into a single volume during the caliphate of Abu Bakr (RA).",
      activity: {
        question: "Who participates in reaching Ijma?",
        options: ["General public", "Qualified Islamic Jurists (Mujtahidun)", "Any individual ruler"],
        correctIndex: 1,
      },
    },
    {
      id: "qiyas",
      number: "04",
      title_ar: "القياس",
      title_en: "Qiyas",
      short_desc: "Analogical reasoning based on existing divine sources.",
      definition: "Applying an established ruling from Quran or Sunnah to a new case due to a shared cause ('Illah).",
      explanation: "It allows Islamic jurisprudence to address modern issues while staying rooted in Quran and Sunnah.",
      example: "Prohibiting modern drugs based on the prohibition of wine ('Illah: intoxication).",
      activity: {
        question: "What is the key component required for Qiyas?",
        options: ["Shared underlying cause ('Illah)", "Popular vote", "Literal translation"],
        correctIndex: 0,
      },
    },
  ],
};

const AiAssistantPage = () => {
  const [prompt, setPrompt] = useState("");
  const [aiPoints, setAiPoints] = useState(10);
  const [fetchingPoints, setFetchingPoints] = useState(true);
  const [loading, setLoading] = useState(false);
  const [canvasData, setCanvasData] = useState(DEFAULT_CANVAS_DATA);

  // Modal State for Card Details
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [activityFeedback, setActivityFeedback] = useState(null);

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = async () => {
    try {
      setFetchingPoints(true);
      const { data } = await API.get("/ai/points");
      if (data.success) {
        setAiPoints(data.aiPoints);
      }
    } catch (err) {
      console.error("Failed to fetch AI Points:", err);
    } finally {
      setFetchingPoints(false);
    }
  };

  const handleGenerateCanvas = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading || aiPoints <= 0) return;

    const userPrompt = prompt.trim();
    setLoading(true);

    try {
      const { data } = await API.post("/ai/ask", {
        prompt: `Generate a visual canvas JSON for: ${userPrompt}`,
      });

      if (data.success) {
        // Try parsing JSON if AI returned stringified JSON
        let parsed = null;
        if (typeof data.answer === "string") {
          try {
            parsed = JSON.parse(data.answer);
          } catch (e) {
            parsed = null;
          }
        } else if (typeof data.answer === "object") {
          parsed = data.answer;
        }

        if (parsed && parsed.nodes) {
          setCanvasData(parsed);
        }

        if (typeof data.remainingPoints === "number") {
          setAiPoints(data.remainingPoints);
        }
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setSelectedAnswer(null);
    setActivityFeedback(null);
  };

  const handleAnswerClick = (optionIndex, correctIndex) => {
    setSelectedAnswer(optionIndex);
    if (optionIndex === correctIndex) {
      setActivityFeedback({ correct: true, msg: "Sahi Jawab! MashAllah 🎉" });
    } else {
      setActivityFeedback({ correct: false, msg: "Galat Jawab. Phir se koshish karein!" });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f12] text-slate-100 font-sans p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#14171d] border border-slate-800/80 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/40 border border-emerald-500/30 rounded-xl text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>AI Visual Learning Canvas</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h1>
              <p className="text-xs text-slate-400">
                Interactive Concept Diagram & Mind-Map Studio
              </p>
            </div>
          </div>

          {/* AI POINTS BADGE */}
          <div className="flex items-center gap-2 bg-[#1b2028] border border-slate-700/60 px-4 py-2 rounded-xl">
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Daily Points:</span>
            <span className="text-xs font-black text-amber-400">
              {fetchingPoints ? "..." : `${aiPoints} / 10`}
            </span>
          </div>
        </header>

        {/* SEARCH / GENERATE CANVAS BAR */}
        <form onSubmit={handleGenerateCanvas} className="relative">
          <div className="relative flex items-center bg-[#14171d] border border-slate-700/80 focus-within:border-emerald-500/80 rounded-2xl p-1.5 transition shadow-inner">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter topic to generate visual canvas (e.g., Usul al-Fiqh, Pillars of Islam)..."
              disabled={loading || aiPoints <= 0}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading || aiPoints <= 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-md shrink-0 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Canvas</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* MAIN VISUAL CANVAS CARD CONTAINER */}
        <main className="bg-[#14171d] border border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Canvas Header Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-300 tracking-wide">
                {canvasData.badge || "AI Visual Learning Studio"}
              </span>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-900/50 border border-emerald-500/30 text-emerald-400 px-3 py-1 rounded-full">
              Interactive
            </span>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-white font-serif tracking-wide">
              {canvasData.title_ur || canvasData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {canvasData.subtitle}
            </p>
          </div>

          {/* Primary Central Banner */}
          {canvasData.header_banner && (
            <div className="bg-gradient-to-r from-emerald-950/80 via-emerald-900/90 to-emerald-950/80 border border-emerald-600/40 rounded-2xl p-4 sm:p-5 text-center shadow-lg space-y-0.5">
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-200 font-serif">
                {canvasData.header_banner.title_ar}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                {canvasData.header_banner.subtitle}
              </p>
            </div>
          )}

          {/* Down Arrow Indicator */}
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-emerald-500/80 animate-bounce" />
          </div>

          {/* Grid of Interactive Canvas Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {canvasData.nodes?.map((node, i) => (
              <div
                key={node.id || i}
                onClick={() => handleSelectNode(node)}
                className="group relative bg-[#1a1e26] border border-amber-500/30 hover:border-amber-400 rounded-2xl p-5 shadow-lg hover:shadow-amber-500/10 transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Node Number Badge */}
                <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-400 font-black text-xs px-3 py-1 rounded-bl-xl border-l border-b border-amber-500/30">
                  {node.number || `0${i + 1}`}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif group-hover:text-amber-400 transition">
                    {node.title_ar}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-400/90">
                    {node.title_en}
                  </p>
                  {node.short_desc && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {node.short_desc}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Tap to explore</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Caption */}
          <p className="text-center text-xs text-slate-500 italic pt-2">
            Illustrative learning diagram — Tap any card to expand definition, examples & quiz
          </p>
        </main>
      </div>

      {/* EXPANDED NODE MODAL DRAWER */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#14171d] border border-slate-700/80 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 text-slate-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                Source {selectedNode.number}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-2 font-serif">
                {selectedNode.title_ar}
              </h2>
              <p className="text-sm font-bold text-amber-400">
                {selectedNode.title_en}
              </p>
            </div>

            {/* Definition & Explanation */}
            <div className="space-y-3">
              <div className="bg-emerald-950/40 border-l-4 border-emerald-500 p-4 rounded-r-2xl space-y-1">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Definition & Explanation
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {selectedNode.definition || selectedNode.explanation}
                </p>
              </div>

              {selectedNode.example && (
                <div className="bg-[#1a1e26] border border-slate-800 p-4 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Example / Misal:
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 italic">
                    "{selectedNode.example}"
                  </p>
                </div>
              )}
            </div>

            {/* Mini Interactive Quiz */}
            {selectedNode.activity && (
              <div className="bg-[#181c23] border border-amber-500/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <HelpCircle className="w-4 h-4" />
                  <span>Mini Interactive Activity</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  {selectedNode.activity.question}
                </p>

                <div className="space-y-2">
                  {selectedNode.activity.options?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() =>
                        handleAnswerClick(
                          idx,
                          selectedNode.activity.correctIndex
                        )
                      }
                      className={`w-full p-3 rounded-xl text-xs sm:text-sm text-left font-medium transition flex items-center justify-between border ${
                        selectedAnswer === idx
                          ? idx === selectedNode.activity.correctIndex
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-rose-600 text-white border-rose-500"
                          : "bg-[#20252f] text-slate-300 border-slate-700 hover:border-amber-500/60"
                      }`}
                    >
                      <span>{option}</span>
                      {selectedAnswer === idx && (
                        <CheckCircle className="w-4 h-4 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                {activityFeedback && (
                  <p
                    className={`text-xs font-bold text-center mt-2 p-2.5 rounded-xl ${
                      activityFeedback.correct
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                        : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {activityFeedback.msg}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AiAssistantPage;