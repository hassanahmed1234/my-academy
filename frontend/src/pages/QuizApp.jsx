import { useState, useEffect, useRef, useCallback } from "react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  ShieldAlert,
  Loader2,
} from "lucide-react";

const QuizApp = () => {
  const { quizData, fetchQuizzes, triggerXpReward } = useAuth();
  const { quizzes, loading: contextQuizLoading, error: quizError } = quizData;

  const [view, setView] = useState("list"); // 'list' | 'instructions' | 'quiz' | 'result'
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const containerRef = useRef(null);

  // Fetch Quizzes on Mount via Context
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  // Handle Final Submit wrapped in useCallback to avoid stale closures
  const handleFetchResults = useCallback(async (attemptId) => {
    try {
      setActionLoading(true);
      const res = await API.get(`/student/quizzes/attempt/${attemptId}/result`);
      setResult(res.data);
      setView("result");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  }, []);

  const handleFinalSubmit = useCallback(async (currentAttemptId, isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit your quiz?")) return;

    try {
      setActionLoading(top => true); // or setActionLoading(true)

      // 1. Submit Quiz (Agar auto-submit nahi hua toh hi hit karein)
      if (!isAuto) {
        await API.post(`/student/quizzes/attempt/${currentAttemptId}/submit`);
      }

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => { });
      }

      // 2. Pehle Result Fetch karein taake pata chale user pass hua ya nahi
      const res = await API.get(`/student/quizzes/attempt/${currentAttemptId}/result`);
      setResult(res.data);
      setView("result");

      // 3. XP SIRF TAB MILEGI JAB USER PASS HO AUR CHEATING NA KI HO!
      if (res.data.passed) {
        const xpRes = await API.post("/xp/award", {
          actionType: "QUIZ_PASS",
          xpAmount: 20,
        });

        const earnedXp = xpRes.data?.earnedXp || 20;

        triggerXpReward({
          xpAmount: earnedXp,
          reason: "perfect_quiz",
          heading: "Excellent Score! 🌟",
        });
      }

    } catch (err) {
      console.error("Quiz submission error:", err);
    } finally {
      setActionLoading(false);
    }
  }, [triggerXpReward]);

  // Handle Timer & Auto-Submit
  useEffect(() => {
    if (view !== "quiz" || !attempt || !attempt.expiresAt) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(attempt.expiresAt).getTime() - new Date().getTime()) / 1000)
      );
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        handleFinalSubmit(attempt._id, true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [view, attempt, handleFinalSubmit]);

  // Anti-Cheat: Tab Visibility & Fullscreen Exit Monitoring
  useEffect(() => {
    if (view !== "quiz" || !attempt) return;

    const handleVisibilityChange = async () => {
      if (document.hidden && view === "quiz" && attempt) {
        try {
          const res = await API.post(`/student/quizzes/attempt/${attempt._id}/violation`, {
            type: "tab_switch",
          });

          // Agar backend ne violation par auto-submit kar diya hai
          if (res.data.autoSubmitted || res.data.failed) {
            alert("⚠️ Quiz failed due to multiple screen/tab violations!");

            if (document.fullscreenElement) {
              document.exitFullscreen().catch(() => { });
            }

            // Result fetch karein
            const resultRes = await API.get(`/student/quizzes/attempt/${attempt._id}/result`);
            setResult(resultRes.data);
            setView("result");
          } else {
            setWarningMsg(`⚠️ Warning: Tab switch detected! ({res.data.tabSwitches || 1}/3)`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement && view === "quiz") {
        try {
          await API.post(`/student/quizzes/attempt/${attempt._id}/violation`, {
            type: "fullscreen_exit",
          });
          setWarningMsg("⚠️ You exited fullscreen mode. Please return to fullscreen!");
        } catch (e) {
          console.error(e);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [view, attempt, handleFinalSubmit]);

  // Actions
  const handleStartQuiz = async () => {
    try {
      setActionLoading(true);
      const res = await API.post(`/student/quizzes/${selectedQuiz._id}/start`);

      const quizMeta = res.data.quiz || res.data;
      const questionsList = res.data.questions || [];

      const timeLimitMs = (quizMeta.timeLimit || 10) * 60 * 1000;
      const expiresAt = res.data.expiresAt || new Date(Date.now() + timeLimitMs).toISOString();

      setAttempt({
        ...quizMeta,
        questions: questionsList,
        expiresAt,
      });

      setCurrentIndex(0);

      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => { });
      }

      setView("quiz");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start quiz.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSelectOption = async (option) => {
    if (!attempt || !attempt.questions) return;

    const currentQ = attempt.questions[currentIndex];

    // FIX: Immutably update questions state to avoid side effects
    const updatedQuestions = attempt.questions.map((q, idx) =>
      idx === currentIndex ? { ...q, selectedAnswer: option } : q
    );

    setAttempt({ ...attempt, questions: updatedQuestions });

    try {
      await API.post(`/student/quizzes/attempt/${attempt._id}/answer`, {
        questionId: currentQ._id,
        selectedAnswer: option,
      });
    } catch (e) {
      console.error("Autosave failed", e);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (contextQuizLoading && view === "list") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
      </div>
    );
  }

  return (
  <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 p-6 sm:p-10 max-w-5xl mx-auto select-none font-sans antialiased">
    
    {/* 1. QUIZ LIST VIEW */}
    {view === "list" && (
      <div className="space-y-8 animate-fadeIn">
        <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="font-serif text-sm tracking-widest text-amber-600 uppercase">الاختبارات الذكية</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mt-1">Quizzes</h1>
            <p className="text-sm text-slate-500 mt-1">Select an active quiz to challenge your expertise and track performance.</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold self-start sm:self-auto shadow-sm">
            Secure Proctored Environment
          </div>
        </div>

        {quizError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl shadow-sm">
            {quizError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white border border-slate-200 p-6 rounded-3xl flex flex-col justify-between space-y-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold uppercase tracking-wider">
                    {quiz.type} Exam
                  </span>
                  <span className="text-slate-500 font-medium truncate max-w-[180px]">
                    {quiz.course?.title || "Module Assessment"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {quiz.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-slate-400">Questions</p>
                    <p className="font-bold text-slate-800 mt-0.5">{quiz.questionCount}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-slate-400">Passing Score</p>
                    <p className="font-bold text-amber-600 mt-0.5">{quiz.passingScore}%</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-slate-400">Duration</p>
                    <p className="font-bold text-slate-800 mt-0.5">{quiz.timeLimit} Mins</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-slate-400">Attempts</p>
                    <p className="font-bold text-slate-800 mt-0.5">{quiz.attemptsUsed || 0} / {quiz.attemptsAllowed}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                {quiz.userPassed ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> Passed ({quiz.bestScore}%)
                  </span>
                ) : <div />}
                <button
                  disabled={quiz.attemptsUsed >= quiz.attemptsAllowed && !quiz.hasActiveAttempt}
                  onClick={() => {
                    setSelectedQuiz(quiz);
                    setView("instructions");
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-1.5"
                >
                  {quiz.hasActiveAttempt ? "Resume Quiz" : "Start Assessment"} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 2. INSTRUCTIONS VIEW */}
    {view === "instructions" && selectedQuiz && (
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm animate-fadeIn">
        <div className="border-b border-slate-200 pb-4">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Examination Protocol</span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{selectedQuiz.title}</h2>
          <p className="text-xs text-slate-500 mt-1">Review the proctoring rules carefully before initializing your session.</p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700">
            <div>
              <p className="text-slate-400">Total Questions</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedQuiz.questionCount}</p>
            </div>
            <div>
              <p className="text-slate-400">Time Limit</p>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedQuiz.timeLimit} Mins</p>
            </div>
            <div>
              <p className="text-slate-400">Min to Pass</p>
              <p className="font-bold text-amber-600 text-sm mt-0.5">{selectedQuiz.passingScore}%</p>
            </div>
          </div>

          <div className="p-5 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl space-y-2 shadow-sm">
            <p className="font-bold flex items-center gap-2 text-amber-700 text-sm">
              <ShieldAlert className="w-4 h-4" /> Strict Monitoring Guidelines:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
              <li>Do NOT switch browser tabs or minimize window (Auto-submits on 3rd violation).</li>
              <li>Browser must remain strictly in Fullscreen mode.</li>
              <li>Do NOT refresh or use browser back/forward buttons during active assessment.</li>
              <li>All selections sync with the secure backend server automatically in real-time.</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 justify-end pt-3">
          <button
            onClick={() => setView("list")}
            className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
          >
            Cancel
          </button>
          <button
            disabled={actionLoading}
            onClick={handleStartQuiz}
            className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
          >
            {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            I Understand & Initialize Quiz
          </button>
        </div>
      </div>
    )}

    {/* 3. ACTIVE QUIZ ROOM */}
    {view === "quiz" && attempt && attempt.questions && (
      <div className="space-y-6 animate-fadeIn">
        <div className="flex justify-between items-center bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div>
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">Question {currentIndex + 1} of {attempt.questions.length}</p>
            <h3 className="font-bold text-base text-slate-900 mt-0.5">Live Assessment Room</h3>
          </div>
          <div className="flex items-center gap-2.5 font-mono text-sm font-bold bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-slate-800 shadow-sm">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span className={timeLeft < 120 ? "text-red-600 animate-bounce" : "text-slate-800"}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {warningMsg && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-3 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" /> 
            <div>
              <p className="font-bold">Proctoring Warning</p>
              <p className="mt-0.5">{warningMsg}</p>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 leading-relaxed">
            {attempt.questions[currentIndex]?.question}
          </h2>

          <div className="space-y-3 pt-2">
            {attempt.questions[currentIndex]?.options?.map((opt, idx) => {
              const isSelected = attempt.questions[currentIndex]?.selectedAnswer === opt;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-center justify-between group ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm"
                      : "bg-slate-50/50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                      isSelected ? "border-emerald-500 bg-emerald-600 text-white" : "border-slate-300 text-slate-500 group-hover:border-slate-400"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                  {isSelected && <CheckSquare className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-slate-50 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex === attempt.questions.length - 1 ? (
            <button
              disabled={actionLoading}
              onClick={() => handleFinalSubmit(attempt._id, false)}
              className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Submit Assessment Final
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex((prev) => prev + 1)}
              className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-emerald-700 transition shadow-sm"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    )}

    {/* 4. RESULT & REVIEW VIEW */}
    {view === "result" && result && (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-5 shadow-sm">
          <div className="inline-flex p-4 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
            {result.passed ? (
              <CheckCircle className="w-14 h-14 text-emerald-600" />
            ) : (
              <XCircle className="w-14 h-14 text-red-600" />
            )}
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl font-extrabold text-slate-900">{result.passed ? "Assessment Passed!" : "Assessment Failed"}</h2>
            <p className="text-xs text-slate-500">{result.quizTitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-400">Score Achieved</p>
              <p className="font-bold text-base text-slate-900 mt-0.5">{result.score} / {result.totalQuestions}</p>
            </div>
            <div>
              <p className="text-slate-400">Percentage</p>
              <p className="font-bold text-base text-amber-600 mt-0.5">{result.percentage}%</p>
            </div>
            <div>
              <p className="text-slate-400">Required Pass</p>
              <p className="font-bold text-base text-slate-700 mt-0.5">{result.passingScore}%</p>
            </div>
          </div>

          <button
            onClick={() => {
              fetchQuizzes();
              setView("list");
            }}
            className="px-7 py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shadow-sm"
          >
            Return to Assessments Hub
          </button>
        </div>

        {result.review && result.review.length > 0 && (
          <div className="bg-white border border-slate-200 p-8 rounded-3xl space-y-5 shadow-sm">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-4 tracking-wide">Detailed Answer Review</h3>
            <div className="space-y-4">
              {result.review.map((q, idx) => (
                <div key={idx} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
                  <div className="flex justify-between items-start gap-3">
                    <p className="font-bold text-slate-900 leading-snug">Q{idx + 1}: {q.questionText}</p>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold tracking-wider uppercase shrink-0 ${
                      q.isCorrect ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"
                    }`}>
                      {q.isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <p className="text-slate-500">Your Selection: <span className={q.isCorrect ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>{q.selectedAnswer || "Not Answered"}</span></p>
                  {!q.isCorrect && <p className="text-amber-700 font-medium">Correct Answer: {q.correctAnswer}</p>}
                  {q.explanation && <p className="text-slate-500 text-[11px] italic mt-1 bg-white p-2.5 rounded-xl border border-slate-200">Explanation: {q.explanation}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default QuizApp;