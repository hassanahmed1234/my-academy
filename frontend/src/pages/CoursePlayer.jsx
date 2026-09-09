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
} from "lucide-react";



const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Player & Progress State
  const [activeLesson, setActiveLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updating, setUpdating] = useState(false);

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

        // 2. Fetch Completed Progress: GET /api/my-progress/:id
        try {
          const { data: progressData } = await API.get(`/my-progress/${id}`);
          setCompletedLessons(progressData.completedLessons || []);
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

  // Toggle Mark as Complete / Incomplete API Handler: POST /api/my-progress/toggle

  const handleToggleComplete = async (lessonId) => {
    if (!lessonId || updating) return;
    try {
      setUpdating(true);
      // Fixed Endpoint: matches POST /api/my-progress/toggle
      const { data } = await API.post("/my-progress/toggle", {
        courseId: id,
        lessonId,
      });
      setCompletedLessons(data.completedLessons || []);
    } catch (err) {
      console.error("Failed to update progress:", err.response?.data || err.message);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wider">LOADING STREAM...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 text-center rounded-3xl space-y-4 shadow-2xl">
          <p className="text-sm font-semibold text-red-400">{error || "Course not found"}</p>
          <Link
            to="/courses"
            className="inline-flex items-center justify-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 pt-4 pb-20 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-800px h-300px   bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* TOP NAVBAR HEADER */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl px-5 py-4 flex items-center justify-between backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-4">
            <Link
              to={`/course/${course._id}`}
              className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
              title="Back to Course Details"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-white line-clamp-1">{course.title}</h1>
              {course.arabicTitle && (
                <p className="text-xs text-amber-400 font-serif font-semibold">{course.arabicTitle}</p>
              )}
            </div>
          </div>

          {/* Progress Tracker Widget */}
          <div className="hidden md:flex items-center gap-4 bg-slate-950/60 border border-slate-800/60 px-4 py-2 rounded-xl">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Course Progress</p>
              <p className="text-xs font-bold text-amber-400">
                {completedCount} / {totalLessons} Lessons ({progressPercentage}%)
              </p>
            </div>
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
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
          <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl aspect-video relative border border-slate-800/80 group">
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
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 space-y-3 bg-slate-900/50">
                <PlayCircle className="w-12 h-12 stroke-1 text-slate-600" />
                <p className="text-xs text-slate-400">Select a lesson from playlist to start streaming.</p>
              </div>
            )}
          </div>

          {/* ACTIVE LESSON METADATA & MARK AS COMPLETE BUTTON */}
          <div className="bg-slate-900/80 border border-slate-800/80 p-6 rounded-3xl space-y-4 shadow-xl backdrop-blur-xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                {activeLesson?.type || "Video Lesson"}
              </span>

              {/* Mark as Complete Button */}
              {activeLesson && (
                <button
                  disabled={updating}
                  onClick={() => handleToggleComplete(currentLessonId)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer ${isCurrentCompleted
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                    : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    }`}
                >
                  {isCurrentCompleted ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4 text-slate-950" />
                      Mark as Complete
                    </>
                  )}
                </button>
              )}
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {activeLesson?.title || "No Lesson Selected"}
              </h2>
              {activeLesson?.duration && (
                <p className="text-xs text-slate-400 mt-1">Duration: {activeLesson.duration}</p>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
              Ensure you take notes during the lecture. For any queries regarding this module, reach out through the Q&A portal.
            </p>
          </div>
        </div>

        {/* SIDEBAR: MODULES & LESSONS ACCORDION */}
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-3xl p-5 space-y-4 shadow-xl backdrop-blur-xl h-fit">
          <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              Course Curriculum
            </h3>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
              {completedCount}/{totalLessons} Done
            </span>
          </div>

          <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1 scrollbar-none">
            {course.modules?.map((module, mIndex) => (
              <div
                key={mIndex}
                className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/60"
              >
                {/* Module Header Toggle */}
                <button
                  onClick={() => toggleModule(mIndex)}
                  className="w-full p-3.5 flex items-center justify-between bg-slate-900/90 hover:bg-slate-800/60 transition text-left cursor-pointer"
                >
                  <span className="text-xs font-bold text-slate-200 line-clamp-1">
                    {module.moduleTitle}
                  </span>
                  {expandedModules[mIndex] ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {/* Lessons List */}
                {expandedModules[mIndex] && (
                  <div className="p-2 space-y-1.5 bg-slate-950/80 border-t border-slate-800/60">
                    {module.lessons?.map((lesson, lIndex) => {
                      const lessonId = lesson._id || lesson.title;
                      const isActive = activeLesson?._id === lesson._id || activeLesson?.title === lesson.title;
                      const isCompleted = completedLessons.includes(lessonId);

                      return (
                        <button
                          key={lIndex}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full p-3 rounded-xl text-left text-xs transition flex items-center justify-between gap-2 cursor-pointer ${isActive
                            ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20"
                            : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5 overflow-hidden">
                            {isCompleted ? (
                              <CheckCircle className={`w-4 h-4 shrink-0 ${isActive ? "text-slate-950" : "text-emerald-400"}`} />
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
                            <span className={`text-[10px] shrink-0 ${isActive ? "text-slate-950 font-bold" : "text-slate-500"}`}>
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
    </main>
  );
};

export default CoursePlayer;