import React from 'react';

const AiErrorCard = ({ onRetry }) => {
  return (
    <div className="w-full max-w-md mx-auto my-6 p-6 rounded-2xl bg-zinc-900/90 border border-amber-500/30 backdrop-blur-md shadow-2xl text-center space-y-4">
      {/* Icon Header */}
      <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>

      {/* Header Info */}
      <div className="space-y-1">
        <span className="text-xs uppercase tracking-widest text-amber-400/80 font-medium">
          AI Study Assistant
        </span>
        <h3 className="text-xl font-bold text-amber-100">Temporarily Busy</h3>
      </div>

      {/* Message Body */}
      <div className="space-y-2 text-zinc-300 text-sm leading-relaxed border-y border-zinc-800/80 py-3">
        <p className="font-semibold text-amber-200/90">
          Ustad AI is taking a short break!
        </p>
        <p className="text-zinc-400 text-xs">
          E-Islam service is currently busy. Please try your question again in a few moments.
        </p>
      </div>

      {/* Action Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-zinc-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all duration-200 shadow-lg shadow-amber-500/10 active:scale-[0.98]"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default AiErrorCard;