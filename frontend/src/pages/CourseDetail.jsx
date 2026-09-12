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

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchCourseAndStatus = async () => {
      try {
        setLoading(true);

        // 1. Fetch Course Data
        const { data: courseData } = await API.get(`/courses/${id}`);
        setCourse(courseData);

        // 2. Check Enrollment Status if User is Logged In
        const token = localStorage.getItem("token");
        // Replace this block inside useEffect:
        if (token) {
          try {
            const { data } = await API.get("/my-courses");

            // Debug: Check exact response structure in browser console

            const enrolledList = data?.data || data?.enrollments || data || [];

            const enrolled = enrolledList.some((item) => {
              const enrolledCourseId = item.course?._id || item.course || item._id;
              return String(enrolledCourseId) === String(id);
            });

            setIsEnrolled(enrolled);
          } catch (statusErr) {
            console.error("Failed to check enrollment status:", statusErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch course details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCourseAndStatus();
  }, [id]);

  const toggleModule = (index) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

 const handleEnrollOrPlay = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
    return;
  }

  // 1. Direct Navigate if state is true
  if (isEnrolled) {
    navigate(`/course/${id}/player`);
    return;
  }

  try {
    setEnrolling(true);
    const response = await API.post(`/enroll/${id}`);

    if (response.data.success) {
      setIsEnrolled(true);
      navigate(`/course/${id}/player`);
    }
  } catch (err) {
    const errorMsg = err.response?.data?.message || "";

    // 2. Fallback: Agar backend bole ke already enrolled ho, to chup-chaap Player par bhej do!
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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
        <p className="text-slate-400 text-xs font-semibold tracking-wider">LOADING COURSE...</p>
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

  const totalLessons = course.modules
    ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
    : 0;

  return (
    <main className="bg-slate-950 min-h-screen text-slate-200 pt-8 pb-24 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER HERO SECTION */}
      <div className="border-b border-slate-800/80 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Title & Metadata */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                  {course.category}
                </span>
                {course.isFree && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    Free Course
                  </span>
                )}
              </div>

              {course.arabicTitle && (
                <p className="font-serif text-3xl sm:text-4xl text-amber-400 font-bold leading-tight">
                  {course.arabicTitle}
                </p>
              )}

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                {course.description ||
                  "Authentic structured curriculum covering traditional Islamic sciences with verified academic references."}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span>
                    Instructor:{" "}
                    <strong className="text-white font-semibold">
                      {course.instructor || "Scholar"}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>
                    {course.modules?.length || 0} Modules ({totalLessons} Lessons)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verified Diploma</span>
                </div>
              </div>
            </div>

            {/* Right Column: ENROLLMENT / ACCESS CARD */}
            <div className="bg-slate-900/90 border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-xl relative">
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-800 bg-slate-950">
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
                <span className="text-xs text-slate-400 font-medium">Access Fee</span>
                <span className="text-2xl font-black text-white">
                  {course.isFree ? (
                    <span className="text-emerald-400">FREE</span>
                  ) : (
                    `PKR ${course.price}`
                  )}
                </span>
              </div>

              {/* DYNAMIC ACTION BUTTON */}
              <button
                onClick={handleEnrollOrPlay}
                disabled={enrolling}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 cursor-pointer disabled:opacity-50"
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

              <div className="space-y-3 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Full lifetime portal access
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> HD Cloud video streaming
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Direct Q&A support
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CURRICULUM SYLLABUS SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-8 relative z-10">
        <div className="border-b border-slate-800/80 pb-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Course Curriculum</h2>
          <p className="text-xs text-slate-400 mt-1">Review the breakdown of modules and video lectures.</p>
        </div>

        <div className="max-w-3xl space-y-4">
          {course.modules?.map((module, mIndex) => (
            <div
              key={mIndex}
              className="bg-slate-900/80 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-colors"
            >
              <button
                onClick={() => toggleModule(mIndex)}
                className="w-full p-5 flex items-center justify-between hover:bg-slate-800/40 transition text-left cursor-pointer"
              >
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">{module.moduleTitle}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{module.lessons?.length || 0} Lessons</p>
                </div>
                {expandedModules[mIndex] ? (
                  <ChevronUp className="w-5 h-5 text-amber-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {expandedModules[mIndex] && (
                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 space-y-2">
                  {module.lessons?.map((lesson, lIndex) => (
                    <div
                      key={lIndex}
                      className="p-3.5 bg-slate-900/90 border border-slate-800/60 rounded-xl flex items-center justify-between text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="font-semibold text-slate-200">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        {lesson.duration && <span className="text-[11px]">{lesson.duration}</span>}
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
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