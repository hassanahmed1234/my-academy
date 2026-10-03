import React from "react";
import { Link } from "react-router-dom";
import { Network, Sparkles, LayoutTemplate, Layers, GitBranch, Workflow, ArrowRight } from "lucide-react";

const VisualCanvasSection = () => {
  return (
    <section className="py-12 sm:py-20 bg-slate-900 text-white relative overflow-hidden my-8 sm:my-12 mx-4 sm:mx-auto rounded-3xl max-w-7xl px-4 sm:px-10 shadow-2xl">
      {/* Background Subtle Glows */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column - Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Visual Canvas AI • INTERACTIVE WORKSPACE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Map Your Islamic Studies <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">
              With Visual Canvas AI
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Complex Tajweed rules, Arabic syntax trees, and Islamic jurisprudence flows ko interactive node-based visual canvas par design aur explore karein—jo E-Islam students ke liye specially banaya gaya hai.
          </p>

          {/* Feature List */}
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {[
              {
                icon: Network,
                title: "Interactive Nodes",
                desc: "Connect concepts and lecture topics visually in real-time.",
              },
              {
                icon: Layers,
                title: "Structured Layers",
                desc: "Break down intricate Fiqh topics into manageable visual cards.",
              },
              {
                icon: GitBranch,
                title: "Branching Logic",
                desc: "Trace grammar roots and rule exceptions effortlessly.",
              },
              {
                icon: Workflow,
                title: "Smart Workflows",
                desc: "Generate dynamic mind maps for quick exam revisions.",
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
              <span>Launch Visual Canvas</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="text-xs text-slate-400 font-medium">Included free with student account</span>
          </div>
        </div>

        {/* Right Column - Visual Canvas Mockup Preview */}
        <div className="lg:col-span-5">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            {/* Canvas Header */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Canvas Workspace</div>
                  <div className="text-[10px] text-emerald-400 font-medium">● Live Nodes Active</div>
                </div>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-mono px-2 py-0.5 rounded border border-emerald-500/20">Synced</span>
            </div>

            {/* Simulated Visual Canvas Nodes Preview */}
            <div className="space-y-3 text-xs relative py-2">
              {/* Node 1 */}
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 shadow-md">
                <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest">Root Concept</div>
                <div className="font-bold text-slate-200 mt-0.5">Tajweed Fundamentals</div>
              </div>

              {/* Connecting Line Indicator */}
              <div className="w-0.5 h-4 bg-emerald-500/40 mx-auto my-[-4px]" />

              {/* Node Grid 2 */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="text-[9px] font-bold text-emerald-400 uppercase">Branch A</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Madd Asli</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700">
                  <div className="text-[9px] font-bold text-amber-400 uppercase">Branch B</div>
                  <div className="text-[11px] font-semibold text-slate-300 mt-0.5">Madd Far'i</div>
                </div>
              </div>
            </div>

            {/* Simulated Canvas Toolbar Footer */}
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Auto-layout enabled
              </span>
              <span className="font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">100% Zoom</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisualCanvasSection;