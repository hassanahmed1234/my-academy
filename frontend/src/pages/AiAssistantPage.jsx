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
    subtitle: "Primary Legal Sources — Bunyadi Sharia Masadir",
  },
  nodes: [
    {
      id: "quran",
      number: "01",
      title_ar: "القرآن الكريم",
      title_ur: "قرآن مجید",
      title_en: "Holy Quran",
      short_desc_ur: "ہدایت اور اسلامی فقہ کا بنیادی اور سب سے پہلا ماخذ۔",
      short_desc_en: "The primary source of divine guidance and Islamic jurisprudence.",
      definition: {
        ar: "كلام الله تعالى المنزل على نبيه محمد صلى الله عليه وسلم المتعبد بتلاوته.",
        ur: "اللہ تعالیٰ کا وہ کلام جو حضرت محمد ﷺ پر حضرت جبرائیلؑ کے ذریعے نازل ہوا اور جس کی تلاوت عبادت ہے۔",
        en: "The verbatim word of Allah revealed to Prophet Muhammad (PBUH) through Angel Jibril.",
      },
      explanation: {
        ur: "یہ تمام شریعت اور اسلامی احکام کی بنیادی بنیاد فراہم کرتا ہے۔ تمام فقہی احکام اسی سے اخذ ہوتے ہیں۔",
        en: "It serves as the foundational legal source from which all fundamental principles of Shariah originate.",
      },
      example: {
        ur: "نماز، زکوۃ اور معاشی معاملات کے لیے دیے گئے بنیادی قرآنی احکامات۔",
        en: "Explicit commands regarding Salah, Zakat, and ethical guidelines for financial transactions.",
      },
      activity: {
        question: "قرآن مجید کا شریعت میں کیا مقام ہے؟",
        options: ["ثانوی ماخذ (Secondary)", "بنیادی اور پہلا ماخذ (Primary Source)", "اختیاری حوالہ (Optional)"],
        correctIndex: 1,
      },
    },
    {
      id: "sunnah",
      number: "02",
      title_ar: "السنة النبوية",
      title_ur: "سنتِ نبوی ﷺ",
      title_en: "Sunnah",
      short_desc_ur: "نبی اکرم ﷺ کے اقوال، افعال اور تقاریر۔",
      short_desc_en: "Sayings, practices, and approvals of Prophet Muhammad (PBUH).",
      definition: {
        ar: "ما أُثر عن النبي صلى الله عليه وسلم من قول أو فعل أو تقرير.",
        ur: "نبی کریم ﷺ سے منقول قول، فعل یا تقریر (کسی کام کو دیکھ کر خاموش رہنا)۔",
        en: "The practical implementation and detailed explanation of Quranic principles by the Prophet (PBUH).",
      },
      explanation: {
        ur: "سنت قرآنی احکام کی تفصیل اور ان کی عملی شکل بیان کرتی ہے۔",
        en: "Sunnah elaborates on general Quranic commandments and specifies how rulings are implemented.",
      },
      example: {
        ur: "نماز کی رکعتوں کی تعداد اور ادا کرنے کا تفصیلی طریقہ جو قرآن میں مجمل تھا۔",
        en: "Detailed procedure and rak'ahs of Salah which are mentioned broadly in the Quran.",
      },
      activity: {
        question: "سنت قرآن مجید کی کس طرح وضاحت کرتی ہے؟",
        options: ["یہ قرآنی احکام کو بدل دیتی ہے", "یہ قرآنی احکام کی تشریح اور تفصیل کرتی ہے", "یہ غیر متعلقہ ہے"],
        correctIndex: 1,
      },
    },
    {
      id: "ijma",
      number: "03",
      title_ar: "الإجماع",
      title_ur: "اجماعِ امت",
      title_en: "Ijma",
      short_desc_ur: "کسی دور کے مجتہدین کا شرعی حکم پر متفق ہونا۔",
      short_desc_en: "Consensus of qualified Islamic scholars on a legal ruling.",
      definition: {
        ar: "اتفاق مجتهدي الأمة الإسلامية في عصر من الأعصار على حكم شرعي.",
        ur: "کسی بھی دور میں امتِ مسلمہ کے تمام اہل السنت مجتہدین کا کسی شرعی معاملے پر متفقہ فیصلہ۔",
        en: "The unanimous agreement of Muslim jurists (Mujtahidun) of a particular era on a religious matter.",
      },
      explanation: {
        ur: "جب کوئی نیا واقعہ یا مسئلہ سامنے آئے اور قرآن و سنت میں نصِ صریح نہ ہو تو علما اجماع کرتے ہیں۔",
        en: "When a new situation arises that is not explicitly detailed in Quran/Sunnah, scholars reach consensus.",
      },
      example: {
        ur: "حضرت ابو بکر صدیق رضی اللہ عنہ کے دور میں قرآن مجید کو ایک نسخے میں جمع کرنے پر صحابہ کا اجماع۔",
        en: "Compilation of the Quran into a single volume during the caliphate of Abu Bakr (RA).",
      },
      activity: {
        question: "اجماع میں کون شامل ہوتے ہیں؟",
        options: ["عام عوام", "اہلِ علم مجتہدین (Qualified Jurists)", "صرف حاکمِ وقت"],
        correctIndex: 1,
      },
    },
    {
      id: "qiyas",
      number: "04",
      title_ar: "القياس",
      title_ur: "قیاس شرعی",
      title_en: "Qiyas",
      short_desc_ur: "مشترکہ علت کی بنیاد پر نئے مسئلے کو اصل مسئلے پر قیاس کرنا۔",
      short_desc_en: "Analogical reasoning based on existing divine sources.",
      definition: {
        ar: "إلحاق فرع بأصل في حكم لعلة جامعة بينهما.",
        ur: "علت (مشترک وجہ) کی بنیاد پر کسی نئے معاملے کو قرآن و سنت کے ثابت شدہ مسئلے پر قیاس کرنا۔",
        en: "Applying an established ruling from Quran or Sunnah to a new case due to a shared cause ('Illah).",
      },
      explanation: {
        ur: "یہ اسلامی فقہ کو جدید دور کے پیدا شدہ مسائل کا حل تلاش کرنے کا طریقہ فراہم کرتا ہے۔",
        en: "It allows Islamic jurisprudence to address modern issues while staying rooted in Quran and Sunnah.",
      },
      example: {
        ur: "شراب کی حرمت پر قیاس کرتے ہوئے جدید منشیات کو حرام قرار دینا (مشترک علت: نشہ/عقل کو متاثر کرنا)۔",
        en: "Prohibiting modern intoxicants/drugs based on the prohibition of wine due to the shared cause ('Illah: intoxication).",
      },
      activity: {
        question: "قیاس کے لیے سب سے بنیادی عنصر کیا ہے؟",
        options: ["مشترکہ علت ('Illah)", "عوامی رائے", "لفظی ترجمہ"],
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
    <div className="min-h-screen w-full bg-slate-50 text-slate-800 font-sans p-3 sm:p-6 lg:p-8 flex flex-col justify-between">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* TOP HEADER BAR */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>AI Visual Learning Canvas</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h1>
              <p className="text-xs text-slate-500">
                Interactive Concept Diagram & Mind-Map Studio
              </p>
            </div>
          </div>

          {/* AI POINTS BADGE */}
          <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200 px-4 py-2 rounded-xl">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-slate-600">Daily Points:</span>
            <span className="text-xs font-black text-amber-600">
              {fetchingPoints ? "..." : `${aiPoints} / 10`}
            </span>
          </div>
        </header>

        {/* SEARCH / GENERATE CANVAS BAR */}
        <form onSubmit={handleGenerateCanvas} className="relative">
          <div className="relative flex items-center bg-white border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 rounded-2xl p-1.5 transition shadow-sm">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter topic to generate visual canvas (e.g., Usul al-Fiqh, Pillars of Islam)..."
              disabled={loading || aiPoints <= 0}
              className="w-full bg-transparent px-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading || aiPoints <= 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 transition shadow-sm shrink-0 cursor-pointer"
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
        <main className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          {/* Canvas Header Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 bg-emerald-100 text-emerald-700 rounded-lg">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold text-slate-600 tracking-wide">
                {canvasData.badge || "AI Visual Learning Studio"}
              </span>
            </div>
            <span className="text-[11px] font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full">
              Interactive
            </span>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-serif tracking-wide">
              {canvasData.title_ur || canvasData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {canvasData.subtitle}
            </p>
          </div>

          {/* Primary Central Banner */}
          {canvasData.header_banner && (
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 border border-emerald-600 rounded-2xl p-4 sm:p-5 text-center shadow-md space-y-0.5 text-white">
              <h3 className="text-xl sm:text-2xl font-bold font-serif">
                {canvasData.header_banner.title_ar}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                {canvasData.header_banner.subtitle}
              </p>
            </div>
          )}

          {/* Down Arrow Indicator */}
          <div className="flex justify-center">
            <ArrowDown className="w-4 h-4 text-emerald-600 animate-bounce" />
          </div>

          {/* Grid of Interactive Canvas Nodes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {canvasData.nodes?.map((node, i) => (
              <div
                key={node.id || i}
                onClick={() => handleSelectNode(node)}
                className="group relative bg-slate-50/70 hover:bg-white border border-amber-300 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
              >
                {/* Node Number Badge */}
                <div className="absolute top-0 right-0 bg-amber-100 text-amber-800 font-black text-xs px-3 py-1 rounded-bl-xl border-l border-b border-amber-300">
                  {node.number || `0${i + 1}`}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif group-hover:text-amber-700 transition">
                    {node.title_ar}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-amber-700">
                    {node.title_en}
                  </p>
                  {node.short_desc && (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {node.short_desc}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-emerald-700 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Tap to explore</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>

          {/* Footer Caption */}
          <p className="text-center text-xs text-slate-400 italic pt-2">
            Illustrative learning diagram — Tap any card to expand definition, examples & quiz
          </p>
        </main>
      </div>

      {/* EXPANDED NODE MODAL DRAWER */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white border border-slate-200 rounded max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-7 relative space-y-5 text-slate-800">
            {/* Close Button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Source {selectedNode.number}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-serif">
                {selectedNode.title_ar}
              </h2>
              <p className="text-sm font-bold text-amber-700">
                {selectedNode.title_en}
              </p>
            </div>

            {/* Definition Section in Modal */}
            <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-4 rounded-r-2xl space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" /> Definition & Meaning
              </h4>

              {/* Arabic Text */}
              {selectedNode.definition?.ar && (
                <p className="text-base sm:text-lg font-serif font-bold text-slate-900 text-right dir-rtl leading-relaxed">
                  {selectedNode.definition.ar}
                </p>
              )}

              {/* Urdu Text */}
              {selectedNode.definition?.ur && (
                <p className="text-xs sm:text-sm text-slate-800 font-serif leading-relaxed text-right dir-rtl">
                  {selectedNode.definition.ur}
                </p>
              )}

              {/* English Text */}
              {selectedNode.definition?.en && (
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-emerald-100 pt-2">
                  {selectedNode.definition.en}
                </p>
              )}
            </div>

            {/* Mini Interactive Quiz */}
            {selectedNode.activity && (
              <div className="bg-amber-50/40 border border-amber-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>Mini Interactive Activity</span>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-slate-800">
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
                      className={`w-full p-3 rounded-xl text-xs sm:text-sm text-left font-medium transition flex items-center justify-between border ${selectedAnswer === idx
                        ? idx === selectedNode.activity.correctIndex
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-rose-600 text-white border-rose-600"
                        : "bg-white text-slate-700 border-slate-200 hover:border-amber-400"
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
                    className={`text-xs font-bold text-center mt-2 p-2.5 rounded-xl ${activityFeedback.correct
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-rose-100 text-rose-800 border border-rose-300"
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