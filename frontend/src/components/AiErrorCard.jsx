import React from "react";
import { Network, RefreshCw, AlertTriangle } from "lucide-react";

const AiErrorCard = ({ onRetry }) => {
  return (
    <div className="w-full max-w-lg mx-auto my-12 p-8 rounded-3xl bg-slate-950/95 border border-amber-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.08)] text-center space-y-6">
      {/* Icon Header with Glow */}
      <div className="relative w-16 h-16 mx-auto">
        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-emerald-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-extrabold bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 inline-block">
          Canvas Generation Notice
        </span>
        <h3 className="text-2xl font-black text-slate-100 font-serif">
          Oops! Canvas Generation Failed
        </h3>
      </div>

      {/* Message Body - Clear & Friendly */}
      <div className="space-y-2 text-slate-300 text-xs sm:text-sm leading-relaxed bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        <p className="font-bold text-amber-300">
          We couldn't generate your visual nodes right now.
        </p>
        <p className="text-slate-400 text-xs leading-relaxed">
          This usually happens due to a temporary AI server timeout or high traffic. Don't worry, your AI points are safe. Please tap below to try loading your canvas again.
        </p>
      </div>

      {/* Action Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full py-3.5 px-6 rounded-2xl font-extrabold text-xs sm:text-sm tracking-wide text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 hover:opacity-95 transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 animate-spin-slow" />
          <span>Reload Visual Learning Canvas</span>
        </button>
      )}
    </div>
  );
};

export default AiErrorCard;