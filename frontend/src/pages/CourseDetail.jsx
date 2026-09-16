import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import {
  BookOpen,
  User,
  ShieldCheck,
  PlayCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Loader2,
  Lock,
  Check,
} from "lucide-react";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState("");
  const [expandedModules, setExpandedModules] = useState({ 0: true });

  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);

  useEffect(() => {
    // Safe Scroll for Mobile Browsers
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 0);
    }

    let isMounted = true;

    const fetchCourseAndProgress = async () => {
      try {
        setLoading(true);
        setError("");

        // 1. Fetch Main Course Document
        const res = await API.get(`/courses/${id}`);
        const courseData = res?.data;

        if (!courseData || !courseData._id) {
          throw new Error("Course details loading failed.");
        }

        if (isMounted) {
          setCourse(courseData);

          // Safe check for active lesson
          if (
            Array.isArray(courseData.modules) &&
            courseData.modules.length > 0 &&
            Array.isArray(courseData.modules[0]?.lessons) &&
            courseData.modules[0].lessons.length > 0
          ) {
            setActiveLesson(courseData.modules[0].lessons[0]);
            setExpandedModules({ 0: true });
          }
        }

        // 2. Fetch User Progress and Check Enrollment Status
        try {
          const { data } = await API.get(`/my-progress/${id}`);
          console.log(data);

          if (isMounted) {
            // Aapki provided line:
            const enrolledList = data?.data?.inProgress || data?.enrollments || data || [];

            // Enrollment check logic
            const checkEnrolled = Array.isArray(enrolledList)
              ? enrolledList.some(
                  (item) => item._id === id || item.course === id || item.courseId === id
                )
              : false;

            setIsEnrolled(checkEnrolled);

            if (data?.completedLessons) {
              setCompletedLessons(data.completedLessons);
            }
          }
        } catch (progErr) {
          console.warn("User progress warning:", progErr?.message);
        }

      } catch (err) {
        console.error("Course Detail Load Error:", err);
        if (isMounted) {
          setError(
            err.response?.data?.message || err.message || "Failed to load course details."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchCourseAndProgress();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleEnrollOrPlay = async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      navigate("/login");
      return;
    }

    if (isEnrolled) {
      navigate(`/course/${id}/player`);
      return;
    }

    try {
      setEnrolling(true);
      const response = await API.post(`/enroll/${id}`);

      if (response?.data?.success) {
        setIsEnrolled(true);
        navigate(`/course/${id}/player`);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "";

      if (errorMsg.toLowerCase().includes("already enrolled")) {
        setIsEnrolled(true);
        navigate(`/course/${id}/player`);
        return;
      }

      alert(errorMsg || "Enrollment failed! Please try again.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3 p-4">
        <Loader2 className="w-9 h-9 text-amber-600 animate-spin" />
        <p className="text-slate-500 text-[11px] font-semibold tracking-wider uppercase">
          Loading Course...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-6 sm:p-8 bg-white border border-slate-200 text-center rounded-3xl space-y-4 shadow-xl">
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

  const totalLessons = course.modules
    ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
    : 0;

  return (
    <main className="bg-slate-50 min-h-screen text-slate-800 pt-6 sm:pt-8 pb-20 sm:pb-24 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 sm:h-80 bg-amber-200/40 blur-[100px] sm:blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-200/30 blur-[90px] sm:blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER HERO SECTION */}
      <div className="border-b border-slate-200/80 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-5 sm:space-y-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {course.category && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full">
                    {course.category}
                  </span>
                )}
                {course.isFree && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full">
                    Free Course
                  </span>
                )}
              </div>

              {course.arabicTitle && (
                <p className="font-serif text-2xl sm:text-4xl text-amber-600 font-bold leading-tight">
                  {course.arabicTitle}
                </p>
              )}

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug sm:leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
                {course.description ||
                  "Authentic structured curriculum covering traditional Islamic sciences with verified academic references."}
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <User className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Instructor:{" "}
                    <strong className="text-slate-900 font-semibold capitalize">
                      {course.instructor || "Scholar"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    {course.modules?.length || 0} Modules ({totalLessons} Lessons)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Diploma</span>
                </div>
              </div>
            </div>

            {/* Right Column: ENROLLMENT CARD */}
            <div className="bg-white/95 border border-slate-200/80 rounded-3xl p-5 sm:p-6 space-y-5 sm:space-y-6 shadow-xl backdrop-blur-xl relative">
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 bg-slate-100">
                <img
                  src={
                    course.image ||
                    "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=800"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Access Fee</span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  {course.isFree || course.price === 0 ? (
                    <span className="text-emerald-600">FREE</span>
                  ) : (
                    `PKR ${course.price}`
                  )}
                </span>
              </div>

              <button
                onClick={handleEnrollOrPlay}
                disabled={enrolling}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {enrolling ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <PlayCircle className="w-4 h-4" />
                )}
                <span>
                  {enrolling
                    ? "Enrolling..."
                    : isEnrolled
                    ? "Continue Learning"
                    : "Enroll Now"}
                </span>
              </button>

              <div className="space-y-2.5 text-xs text-slate-600 pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Full lifetime portal access
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" /> HD Cloud video streaming
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" /> Direct Q&A support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURRICULUM SYLLABUS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-6 sm:space-y-8 relative z-10">
        <div className="border-b border-slate-200/80 pb-3 sm:pb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Course Curriculum
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review the breakdown of modules and video lectures.
          </p>
        </div>

        <div className="max-w-3xl space-y-3 sm:space-y-4">
          {course.modules?.map((module, mIndex) => (
            <div
              key={module._id || mIndex}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleModule(mIndex)}
                className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 active:bg-slate-100 transition text-left cursor-pointer"
              >
                <div className="pr-2">
                  <h3 className="text-xs sm:text-base font-bold text-slate-900">
                    {module.moduleTitle}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {module.lessons?.length || 0} Lessons
                  </p>
                </div>
                {expandedModules[mIndex] ? (
                  <ChevronUp className="w-5 h-5 text-amber-600 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {expandedModules[mIndex] && (
                <div className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-200 space-y-2">
                  {module.lessons?.map((lesson, lIndex) => {
                    const isCompleted = completedLessons.includes(lesson._id);
                    return (
                      <div
                        key={lesson._id || lIndex}
                        className="p-3 sm:p-3.5 bg-white border border-slate-200/80 rounded-xl flex items-center justify-between text-xs gap-3 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <PlayCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="font-semibold text-slate-800 truncate">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 shrink-0">
                          {lesson.duration && (
                            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                              {lesson.duration}
                            </span>
                          )}
                          {isCompleted ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : !isEnrolled ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default CourseDetail;