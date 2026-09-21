import React from "react";
import { Link } from "react-router-dom";
import { Bot, Sparkles, MessageSquare, BookOpenCheck, Zap, HelpCircle, ArrowRight } from "lucide-react";

const AIStudyAssistantSection = () => {
  return (
    /* FIXED: Mobile ke liye `mx-4` aur `my-8` add kiya hai, sm breakpoint par `sm:mx-auto` aur `sm:my-12` handle hoga */
    <section className="py-12 sm:py-20 bg-slate-900 text-white relative overflow-hidden my-8 sm:my-12 mx-4 sm:mx-auto rounded-3xl max-w-7xl px-4 sm:px-10 shadow-2xl">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column - Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Study Assistant • LIVE NOW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Meet Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              Islamic AI Tutor
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Get instant clarifications on course lectures, Tajweed rules, Arabic vocabulary, and Islamic jurisprudence—powered by modern AI tuned specifically for E-Islam students.
          </p>

          {/* Feature List */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                icon: MessageSquare,
                title: "Instant Q&A",
                desc: "Ask questions about lecture notes anytime 24/7.",
              },
              {
                icon: BookOpenCheck,
                title: "Tajweed & Grammar",
                desc: "Get quick assistance on rules and syntax.",
              },
              {
                icon: Zap,
                title: "Smart Summaries",
                desc: "Generate concise summaries for revision.",
              },
              {
                icon: HelpCircle,
                title: "Quiz Prep",
                desc: "Practice instant flashcard questions before exams.",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/ai-assistant"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs tracking-wide shadow-lg shadow-amber-500/20 transition active:scale-[0.98]"
            >
              <span>Try AI Assistant Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-400 font-medium">Included free with student account</span>
          </div>
        </div>

        {/* Right Column - Mockup Preview */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">E-Islam Bot</div>
                  <div className="text-[10px] text-emerald-400 font-medium">● Online</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">Live</span>
            </div>

            {/* Simulated Chat Messages */}
            <div className="space-y-3 text-xs">
              {/* User Msg */}
              <div className="flex justify-end">
                <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed">
                  Assalamu Alaikum! What is the difference between Madd Asli and Madd الفرعي?
                </div>
              </div>

              {/* AI Msg */}
              <div className="flex justify-start">
                <div className="bg-slate-700/80 text-slate-200 border border-slate-600/60 p-3 rounded-2xl rounded-tl-none max-w-[90%] space-y-1.5 leading-relaxed">
                  <p className="font-semibold text-amber-400">Wa Alaikum Assalam! 🌸</p>
                  <p>
                    <strong>Madd Asli (Natural):</strong> Prolonged for 2 counts without Hamzah or Sukoon after it.
                  </p>
                  <p>
                    <strong>Madd Far'i (Secondary):</strong> Caused by a Hamzah or Sukoon following the Madd letter.
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Input Field */}
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center gap-2">
              <input
                type="text"
                disabled
                placeholder="Ask your study question..."
                className="w-full bg-slate-900/80 border border-slate-700 text-xs text-slate-400 rounded-xl px-3.5 py-2.5 cursor-not-allowed opacity-80"
              />
              <button disabled className="bg-amber-500 text-slate-950 font-bold p-2.5 rounded-xl opacity-80 cursor-not-allowed">
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIStudyAssistantSection;