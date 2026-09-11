import { useState, useEffect, useRef } from "react";
import API from "../api/axiosInstance";
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
  const [view, setView] = useState("list"); // 'list' | 'instructions' | 'quiz' | 'result'
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warningMsg, setWarningMsg] = useState("");
  const containerRef = useRef(null);

  // Fetch Quiz List
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await API.get("/quizzes");
      setQuizzes(Array.isArray(res.data) ? res.data : res.data.quizzes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

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
      setLoading(true);
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
      setLoading(false);
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
      setLoading(true);
      await API.post(`/student/quizzes/attempt/${attempt._id}/submit`);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      handleFetchResults(attempt._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchResults = async (attemptId) => {
    try {
      setLoading(true);
      const res = await API.get(`/student/quizzes/attempt/${attemptId}/result`);
      setResult(res.data);
      setView("result");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-islamic-bg flex items-center justify-center text-islamic-text">
        <Loader2 className="w-8 h-8 text-islamic-primary animate-spin" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-islamic-bg text-islamic-text p-6 max-w-5xl mx-auto select-none">
      {/* 1. QUIZ LIST VIEW */}
      {view === "list" && (
        <div className="space-y-6">
          <div className="border-b border-islamic-border pb-4">
            <span className="font-arabic text-xl text-islamic-gold">الاختبارات</span>
            <h1 className="text-2xl font-bold">Course Assessments & Quizzes</h1>
            <p className="text-xs text-islamic-muted">Select an assessment to test your knowledge.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-islamic-card border border-islamic-border p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px] text-islamic-gold font-bold uppercase">
                    <span>{quiz.type} Exam</span>
                    <span>{quiz.course?.title || "Course Assessment"}</span>
                  </div>
                  <h3 className="text-lg font-bold mt-1">{quiz.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-islamic-muted mt-3">
                    <p>Questions: {quiz.questionCount}</p>
                    <p>Passing: {quiz.passingScore}%</p>
                    <p>Time: {quiz.timeLimit} Mins</p>
                    <p>Attempts: {quiz.attemptsUsed || 0} / {quiz.attemptsAllowed}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-islamic-border flex items-center justify-between">
                  {quiz.userPassed && (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Passed ({quiz.bestScore}%)
                    </span>
                  )}
                  <button
                    disabled={quiz.attemptsUsed >= quiz.attemptsAllowed && !quiz.hasActiveAttempt}
                    onClick={() => {
                      setSelectedQuiz(quiz);
                      setView("instructions");
                    }}
                    className="px-4 py-2 bg-islamic-primary text-white text-xs font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition"
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
        <div className="max-w-2xl mx-auto bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-islamic-border pb-4">
            <h2 className="text-xl font-bold">{selectedQuiz.title} Instructions</h2>
            <p className="text-xs text-islamic-muted mt-1">Read the anti-cheat & assessment guidelines carefully.</p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-islamic-bg rounded-xl space-y-1">
              <p>• <strong>Questions:</strong> {selectedQuiz.questionCount}</p>
              <p>• <strong>Time Limit:</strong> {selectedQuiz.timeLimit} Minutes</p>
              <p>• <strong>Passing Score:</strong> {selectedQuiz.passingScore}%</p>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 rounded-xl space-y-1">
              <p className="font-bold flex items-center gap-1.5"><ShieldAlert className="w-4 h-4" /> Rules & Monitoring:</p>
              <p>1. Do NOT switch browser tabs (Auto-submits on 3rd warning).</p>
              <p>2. Keep browser in fullscreen mode.</p>
              <p>3. Do NOT refresh or navigate away.</p>
              <p>4. Your answers are automatically saved to the server in real-time.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setView("list")}
              className="px-4 py-2 text-xs font-bold text-islamic-muted hover:text-islamic-text"
            >
              Cancel
            </button>
            <button
              onClick={handleStartQuiz}
              className="px-5 py-2.5 bg-islamic-gold text-slate-900 text-xs font-bold rounded-xl hover:opacity-90 transition"
            >
              I Understand & Start Quiz
            </button>
          </div>
        </div>
      )}

      {/* 3. ACTIVE QUIZ ROOM */}
      {view === "quiz" && attempt && attempt.questions && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center bg-islamic-card border border-islamic-border p-4 rounded-2xl">
            <div>
              <p className="text-xs text-islamic-muted">Question {currentIndex + 1} of {attempt.questions.length}</p>
              <h3 className="font-bold text-sm">Attempting Assessment</h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-sm font-bold bg-islamic-bg px-3 py-1.5 rounded-xl border border-islamic-border">
              <Clock className="w-4 h-4 text-islamic-gold" />
              <span className={timeLeft < 120 ? "text-red-400 animate-pulse" : "text-islamic-text"}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {warningMsg && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {warningMsg}
            </div>
          )}

          {/* Question Box */}
          <div className="bg-islamic-card border border-islamic-border p-6 rounded-2xl space-y-6">
            <h2 className="text-base font-bold">{attempt.questions[currentIndex]?.question}</h2>

            <div className="space-y-3">
              {attempt.questions[currentIndex]?.options?.map((opt, idx) => {
                const isSelected = attempt.questions[currentIndex]?.selectedAnswer === opt;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 text-xs rounded-xl border transition flex items-center justify-between ${
                      isSelected
                        ? "bg-islamic-primary/20 border-islamic-primary text-emerald-300 font-bold"
                        : "bg-islamic-bg border-islamic-border hover:border-islamic-gold"
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckSquare className="w-4 h-4 text-islamic-primary" />}
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
              className="px-4 py-2 bg-islamic-card border border-islamic-border rounded-xl text-xs font-bold disabled:opacity-50 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Previous
            </button>

            {currentIndex === attempt.questions.length - 1 ? (
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-5 py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-4 py-2 bg-islamic-primary text-white rounded-xl text-xs font-bold flex items-center gap-1"
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
          <div className="bg-islamic-card border border-islamic-border p-6 rounded-2xl text-center space-y-4 shadow-xl">
            <div className="inline-flex p-3 rounded-full bg-islamic-bg border border-islamic-border">
              {result.passed ? (
                <CheckCircle className="w-12 h-12 text-emerald-400" />
              ) : (
                <XCircle className="w-12 h-12 text-red-400" />
              )}
            </div>

            <div>
              <h2 className="text-2xl font-bold">{result.passed ? "Congratulations! Passed" : "Assessment Failed"}</h2>
              <p className="text-xs text-islamic-muted mt-1">{result.quizTitle}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto p-4 bg-islamic-bg rounded-xl border border-islamic-border text-xs">
              <div>
                <p className="text-islamic-muted">Score</p>
                <p className="font-bold text-sm">{result.score} / {result.totalQuestions}</p>
              </div>
              <div>
                <p className="text-islamic-muted">Percentage</p>
                <p className="font-bold text-sm text-islamic-gold">{result.percentage}%</p>
              </div>
              <div>
                <p className="text-islamic-muted">Passing</p>
                <p className="font-bold text-sm">{result.passingScore}%</p>
              </div>
            </div>

            <button
              onClick={() => {
                fetchQuizzes();
                setView("list");
              }}
              className="px-6 py-2.5 bg-islamic-primary text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition"
            >
              Back to Assessments List
            </button>
          </div>

          {/* Detailed Question Review */}
          {result.review && result.review.length > 0 && (
            <div className="bg-islamic-card border border-islamic-border p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-islamic-border pb-3">Detailed Answer Review</h3>
              <div className="space-y-4">
                {result.review.map((q, idx) => (
                  <div key={idx} className="p-4 bg-islamic-bg rounded-xl border border-islamic-border space-y-2 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-bold">Q{idx + 1}: {q.questionText}</p>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${q.isCorrect ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                        {q.isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <p className="text-islamic-muted">Your Answer: <span className={q.isCorrect ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>{q.selectedAnswer || "Not Answered"}</span></p>
                    {!q.isCorrect && <p className="text-islamic-gold">Correct Answer: {q.correctAnswer}</p>}
                    {q.explanation && <p className="text-islamic-muted text-[11px] italic mt-1">Explanation: {q.explanation}</p>}
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