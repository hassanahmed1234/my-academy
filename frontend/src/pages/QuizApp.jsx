import { useState, useEffect, useRef } from "react";
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
  const { quizData, fetchQuizzes,triggerXpReward } = useAuth();
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
        handleFinalSubmit(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [view, attempt]);

  // Anti-Cheat: Tab Visibility & Fullscreen Exit Monitoring
  useEffect(() => {
    if (view !== "quiz" || !attempt) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        try {
          const res = await API.post(`/student/quizzes/attempt/${attempt._id}/violation`, {
            type: "tab_switch",
          });
          if (res.data.autoSubmitted) {
            alert("Quiz auto-submitted due to excessive tab switching!");
            handleFetchResults(attempt._id);
          } else {
            setWarningMsg(`⚠️ Warning: Do not switch tabs! Warning count: ${res.data.tabSwitches || 1}/2`);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };

    const handleFullscreenChange = async () => {
      if (!document.fullscreenElement) {
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
  }, [view, attempt]);

  // Actions
  const handleStartQuiz = async () => {
    try {
      setActionLoading(true);
      const res = await API.post(`/student/quizzes/${selectedQuiz._id}/start`);
      
      const quizMeta = res.data.quiz || res.data;
      const questionsList = res.data.questions || [];

      // Expiry timestamp setup based on timeLimit (Minutes)
      const timeLimitMs = (quizMeta.timeLimit || 10) * 60 * 1000;
      const expiresAt = res.data.expiresAt || new Date(Date.now() + timeLimitMs).toISOString();

      setAttempt({
        ...quizMeta,
        questions: questionsList,
        expiresAt,
      });

      setCurrentIndex(0);

      // Request Fullscreen
      if (containerRef.current && containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen().catch(() => {});
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
    const updatedQuestions = [...attempt.questions];
    updatedQuestions[currentIndex].selectedAnswer = option;
    setAttempt({ ...attempt, questions: updatedQuestions });

    try {
      await API.post(`/student/quizzes/attempt/${attempt._id}/answer`, {
        questionId: currentQ._id, // Standard Mongo _id
        selectedAnswer: option,
      });
    } catch (e) {
      console.error("Autosave failed", e);
    }
  };

const handleFinalSubmit = async (isAuto = false) => {
    if (!isAuto && !window.confirm("Are you sure you want to submit your quiz?")) return;

    try {
        setActionLoading(true);

        // 1. Submit Quiz
        await API.post(`/student/quizzes/attempt/${attempt._id}/submit`);

        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }

        // 2. Direct API call to Award XP
        const xpRes = await API.post("/xp/award", {
            actionType: "QUIZ_PASS",
            xpAmount: 20, // Customize amount or omit to let BE decide default
        });

        const earnedXp = xpRes.data?.earnedXp || 20;

        // 3. Trigger Modal with Response Data
        triggerXpReward({
            xpAmount: earnedXp,
            reason: "perfect_quiz",
            heading: "Excellent Score! 🌟",
        });

        handleFetchResults(attempt._id);
    } catch (err) {
        console.error("Quiz submission / XP award error:", err);
    } finally {
        setActionLoading(false);
    }
};

  const handleFetchResults = async (attemptId) => {
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
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-800 p-6 max-w-5xl mx-auto select-none font-sans">
      {/* 1. QUIZ LIST VIEW */}
      {view === "list" && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="font-serif text-xl text-amber-600">الاختبارات</span>
            <h1 className="text-2xl font-extrabold text-slate-900">Course Assessments & Quizzes</h1>
            <p className="text-xs text-slate-500">Select an assessment to test your knowledge.</p>
          </div>

          {quizError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {quizError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] text-emerald-700 font-extrabold uppercase">
                    <span>{quiz.type} Exam</span>
                    <span className="text-slate-500">{quiz.course?.title || "Course Assessment"}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{quiz.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-3">
                    <p>Questions: <span className="font-semibold text-slate-700">{quiz.questionCount}</span></p>
                    <p>Passing: <span className="font-semibold text-slate-700">{quiz.passingScore}%</span></p>
                    <p>Time: <span className="font-semibold text-slate-700">{quiz.timeLimit} Mins</span></p>
                    <p>Attempts: <span className="font-semibold text-slate-700">{quiz.attemptsUsed || 0} / {quiz.attemptsAllowed}</span></p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {quiz.userPassed ? (
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Passed ({quiz.bestScore}%)
                    </span>
                  ) : <div />}
                  <button
                    disabled={quiz.attemptsUsed >= quiz.attemptsAllowed && !quiz.hasActiveAttempt}
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setView("instructions");
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm"
                  >
                    {quiz.hasActiveAttempt ? "Resume Quiz →" : "Start Quiz →"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. INSTRUCTIONS VIEW */}
      {view === "instructions" && selectedQuiz && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-xl font-bold text-slate-900">{selectedQuiz.title} Instructions</h2>
            <p className="text-xs text-slate-500 mt-1">Read the anti-cheat & assessment guidelines carefully.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-slate-700">
              <p>• <strong>Questions:</strong> {selectedQuiz.questionCount}</p>
              <p>• <strong>Time Limit:</strong> {selectedQuiz.timeLimit} Minutes</p>
              <p>• <strong>Passing Score:</strong> {selectedQuiz.passingScore}%</p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl space-y-1">
              <p className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-amber-600" /> Rules & Monitoring:</p>
              <p>1. Do NOT switch browser tabs (Auto-submits on 3rd warning).</p>
              <p>2. Keep browser in fullscreen mode.</p>
              <p>3. Do NOT refresh or navigate away.</p>
              <p>4. Your answers are automatically saved to the server in real-time.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              Cancel
            </button>
            <button
              disabled={actionLoading}
              onClick={handleStartQuiz}
              className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
            >
              {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              I Understand & Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE QUIZ ROOM */}
      {view === "quiz" && attempt && attempt.questions && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div>
              <p className="text-xs text-slate-500">Question {currentIndex + 1} of {attempt.questions.length}</p>
              <h3 className="font-bold text-sm text-slate-900">Attempting Assessment</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <Clock className="w-4 h-4 text-amber-600" />
              <span className={timeLeft < 120 ? "text-red-600 animate-pulse" : "text-slate-800"}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {warningMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 shadow-sm">
              <AlertTriangle className="w-4 h-4 text-red-600" /> {warningMsg}
            </div>
          )}

          {/* Question Box */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">{attempt.questions[currentIndex]?.question}</h2>

            <div className="space-y-3">
              {attempt.questions[currentIndex]?.options?.map((opt, idx) => {
                const isSelected = attempt.questions[currentIndex]?.selectedAnswer === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 text-xs rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold"
                        : "bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-100/50"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckSquare className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flex justify-between items-center">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1 hover:bg-slate-50 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === attempt.questions.length - 1 ? (
              <button
                disabled={actionLoading}
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-emerald-700 transition shadow-sm"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. RESULT & REVIEW VIEW */}
      {view === "result" && result && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl text-center space-y-4 shadow-sm">
            <div className="inline-flex p-3 rounded-full bg-slate-50 border border-slate-200">
              {result.passed ? (
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              ) : (
                <XCircle className="w-12 h-12 text-red-600" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">{result.passed ? "Congratulations! Passed" : "Assessment Failed"}</h2>
              <p className="text-xs text-slate-500 mt-1">{result.quizTitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500">Score</p>
                <p className="font-bold text-sm text-slate-900">{result.score} / {result.totalQuestions}</p>
              </div>
              <div>
                <p className="text-slate-500">Percentage</p>
                <p className="font-bold text-sm text-amber-600">{result.percentage}%</p>
              </div>
              <div>
                <p className="text-slate-500">Passing</p>
                <p className="font-bold text-sm text-slate-900">{result.passingScore}%</p>
              </div>
            </div>

            <button
              onClick={() => {
                fetchQuizzes(true); // Force refresh updated attempt state
                setView("list");
              }}
              className="px-6 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition shadow-sm"
            >
              Back to Assessments List
            </button>
          </div>

          {/* Detailed Question Review */}
          {result.review && result.review.length > 0 && (
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-3">Detailed Answer Review</h3>
              <div className="space-y-4">
                {result.review.map((q, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold text-slate-900">Q{idx + 1}: {q.questionText}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                        {q.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <p className="text-slate-600">Your Answer: <span className={q.isCorrect ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}>{q.selectedAnswer || "Not Answered"}</span></p>
                    {!q.isCorrect && <p className="text-amber-700 font-medium">Correct Answer: {q.correctAnswer}</p>}
                    {q.explanation && <p className="text-slate-500 text-[11px] italic mt-1">Explanation: {q.explanation}</p>}
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