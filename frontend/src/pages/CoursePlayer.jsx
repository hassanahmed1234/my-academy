import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import {
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
  BookOpen,
  FileText,
  HelpCircle,
  CheckCircle,
  Circle,
  Award,
  Share2,
  Instagram,
  Copy,
  X,
  Trophy,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const CoursePlayer = () => {
  const { triggerXpReward } = useAuth();

  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Player & Progress State
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updating, setUpdating] = useState(false);

  // Social CTA Completion Modal State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchCourseAndProgress = async () => {
      try {
        // 1. Fetch Course Details
        const { data } = await API.get(`/courses/${id}`);
        setCourse(data);

        // Set first lesson as default active
        if (data.modules?.length > 0 && data.modules[0].lessons?.length > 0) {
          setActiveLesson(data.modules[0].lessons[0]);
          setExpandedModules({ 0: true });
        }

        // 2. Fetch Completed Progress
        try {
          const { data: progressData } = await API.get(`/my-progress/${id}`);
          const fetchedCompleted = progressData.completedLessons || [];
          setCompletedLessons(fetchedCompleted);

          // Calculate total lessons count
          const total = data.modules?.flatMap((m) => m.lessons).length || 0;
          if (total > 0 && fetchedCompleted.length === total) {
            setShowCompletionModal(true);
          }
        } catch (progErr) {
          console.warn("Could not fetch user progress", progErr);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load course video stream.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndProgress();
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Mark as Complete API Handler
  const handleMarkAsComplete = async (lessonId) => {
    if (!lessonId || updating || isCurrentCompleted) return;
    try {
      setUpdating(true);

      // 1. Mark lesson as complete in Database
      const { data } = await API.post("/my-progress/complete", {
        courseId: id,
        lessonId,
      });

      const updatedCompleted = data.completedLessons || [];
      setCompletedLessons(updatedCompleted);

      // 2. Direct API call to Award XP for Lesson Completion
      let earnedXp = 15;
      try {
        const xpRes = await API.post("/xp/award", {
          actionType: "LESSON_COMPLETE",
          xpAmount: 15,
        });
        if (xpRes.data?.earnedXp) {
          earnedXp = xpRes.data.earnedXp;
        }
      } catch (xpErr) {
        console.error("XP Award API error:", xpErr.response?.data || xpErr.message);
      }

      // Check if course completed completely on this action
      const isAllDone = totalLessons > 0 && updatedCompleted.length === totalLessons;

      if (isAllDone) {
        // Extra Course Completion XP Reward Trigger
        triggerXpReward({
          xpAmount: 500,
          reason: "course_completed",
          heading: "🎉 Alhamdulillah! Course Completed",
        });
        setShowCompletionModal(true);
      } else {
        // Regular Lesson XP Reward
        triggerXpReward({
          xpAmount: earnedXp,
          reason: "lesson_completed",
          heading: "Lesson Completed! 🌟",
        });
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete:", err.response?.data || err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Calculate Progress Metrics
  const allLessons = course?.modules?.flatMap((m) => m.lessons) || [];
  const totalLessons = allLessons.length;
  const completedCount = completedLessons.length;
  const progressPercentage =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const currentLessonId = activeLesson?._id || activeLesson?.title;
  const isCurrentCompleted = completedLessons.includes(currentLessonId);

  // Social Share Text Handler
  const shareText = `🎉 Alhamdulillah! I completed "${course?.title}" on learning platform! 🌟 +500 XP Earned! 🏆`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/course/${id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-amber-600 animate-spin" />
        <p className="text-slate-500 text-xs font-semibold tracking-wider">LOADING STREAM...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-white border border-slate-200 text-center rounded-3xl space-y-4 shadow-xl">
          <p className="text-sm font-semibold text-rose-600">{error || "Course not found"}</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-amber-600 hover:text-amber-700 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 pt-4 pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-200/40 blur-[150px] rounded-full pointer-events-none" />

      {/* TOP NAVBAR HEADER */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-white/90 border border-slate-200/80 rounded-2xl px-5 py-4 flex items-center justify-between backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-4">
            <Link
              to={`/course/${course._id}`}
              className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
              title="Back to Course Details"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">{course.title}</h1>
              {course.arabicTitle && (
                <p className="text-xs text-amber-600 font-serif font-semibold">{course.arabicTitle}</p>
              )}
            </div>
          </div>

          {/* Progress Tracker Widget */}
          <div className="hidden md:flex items-center gap-4 bg-slate-100/80 border border-slate-200 px-4 py-2 rounded-xl">
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Course Progress</p>
              <p className="text-xs font-bold text-amber-700">
                {completedCount} / {totalLessons} Lessons ({progressPercentage}%)
              </p>
            </div>
            <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden border border-slate-300">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* PLAYER & PLAYLIST LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">

        {/* MAIN VIDEO STREAMING AREA */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl aspect-video relative border border-slate-300 group">
            {activeLesson?.cloudinaryUrl ? (
              <video
                key={activeLesson.cloudinaryUrl}
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
                autoPlay
              >
                <source src={activeLesson.cloudinaryUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-3 bg-slate-900">
                <PlayCircle className="w-12 h-12 stroke-1 text-slate-500" />
                <p className="text-xs text-slate-300">Select a lesson from playlist to start streaming.</p>
              </div>
            )}
          </div>

          {/* ACTIVE LESSON METADATA & MARK AS COMPLETE BUTTON */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                {activeLesson?.type || "Video Lesson"}
              </span>

              {/* Mark as Complete Button */}
              {activeLesson && (
                <button
                  disabled={updating || isCurrentCompleted}
                  onClick={() => handleMarkAsComplete(currentLessonId)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                    isCurrentCompleted
                      ? "bg-emerald-50 border border-emerald-300 text-emerald-700 opacity-80 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer"
                  }`}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-950" />
                      {updating ? "Updating..." : "Mark as Complete"}
                    </>
                  )}
                </button>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                {activeLesson?.title || "No Lesson Selected"}
              </h2>
              {activeLesson?.duration && (
                <p className="text-xs text-slate-500 mt-1">Duration: {activeLesson.duration}</p>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
              Ensure you take notes during the lecture. For any queries regarding this module, reach out through the Q&A portal.
            </p>
          </div>
        </div>

        {/* SIDEBAR: MODULES & LESSONS ACCORDION */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm backdrop-blur-xl h-fit">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Course Curriculum
            </h3>
            <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              {completedCount}/{totalLessons} Done
            </span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-none">
            {course.modules?.map((module, mIndex) => (
              <div
                key={mIndex}
                className="border border-slate-200/80 rounded-2xl overflow-hidden bg-slate-50/50"
              >
                {/* Module Header Toggle */}
                <button
                  onClick={() => toggleModule(mIndex)}
                  className="w-full p-3.5 flex items-center justify-between bg-slate-100/80 hover:bg-slate-200/60 transition text-left cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {module.moduleTitle}
                  </span>
                  {expandedModules[mIndex] ? (
                    <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Lessons List */}
                {expandedModules[mIndex] && (
                  <div className="p-2 space-y-1.5 bg-white border-t border-slate-200">
                    {module.lessons?.map((lesson, lIndex) => {
                      const lessonId = lesson._id || lesson.title;
                      const isActive =
                        activeLesson?._id === lesson._id || activeLesson?.title === lesson.title;
                      const isCompleted = completedLessons.includes(lessonId);

                      return (
                        <button
                          key={lIndex}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition flex items-center justify-between gap-2 cursor-pointer ${
                            isActive
                              ? "bg-amber-500 text-slate-950 font-black shadow-md"
                              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {isCompleted ? (
                              <CheckCircle
                                className={`w-4 h-4 shrink-0 ${
                                  isActive ? "text-slate-950" : "text-emerald-600"
                                }`}
                              />
                            ) : lesson.type === "quiz" ? (
                              <HelpCircle className="w-4 h-4 shrink-0" />
                            ) : lesson.type === "assignment" ? (
                              <FileText className="w-4 h-4 shrink-0" />
                            ) : (
                              <PlayCircle className="w-4 h-4 shrink-0" />
                            )}
                            <span className="truncate">{lesson.title}</span>
                          </div>
                          {lesson.duration && (
                            <span
                              className={`text-[10px] shrink-0 ${
                                isActive ? "text-slate-950 font-bold" : "text-slate-400"
                              }`}
                            >
                              {lesson.duration}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 📢 11. "I COMPLETED IT" SOCIAL CTA MODAL (INSTAGRAM STORY ORIENTED) */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl text-center space-y-5 overflow-hidden">
            
            {/* Top Glowing Ambient Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/20 blur-2xl rounded-full pointer-events-none" />

            {/* Close Modal Button */}
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition rounded-full bg-slate-800/50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* INSTAGRAM STORY PREVIEW CARD */}
            <div className="relative z-10 bg-gradient-to-b from-amber-500/10 via-slate-800/80 to-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-inner">
              
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 animate-bounce">
                  <Trophy className="w-8 h-8 text-slate-950" />
                </div>
              </div>

              <div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-widest text-amber-400 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  <Sparkles className="w-3 h-3" /> Course Completed
                </span>
                <h3 className="text-xl font-extrabold text-white mt-2">
                  🎉 Alhamdulillah!
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  You've completed <span className="font-semibold text-amber-300">{course.title}</span>
                </p>
              </div>

              {/* XP Rewards Badge */}
              <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl py-2 px-4 inline-flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-black text-amber-300">+500 XP Earned</span>
              </div>

              {/* Story Visual Badge Box */}
              <div className="border border-dashed border-slate-700 bg-slate-900/60 rounded-xl p-3 flex items-center justify-between text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">New Badge Unlocked</p>
                    <p className="text-xs font-bold text-white">Mastery Scholar 🏆</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS & SOCIAL SHARING */}
            <div className="space-y-2 pt-1">
              <p className="text-[11px] text-slate-400 font-medium">Share your achievement on Instagram Stories!</p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-slate-950" /> Copied Text!
                    </>
                  ) : (
                    <>
                      <Instagram className="w-4 h-4 text-slate-950" /> Copy for Story
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopyLink}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition cursor-pointer"
                  title="Copy Share Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
};

export default CoursePlayer;