import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";
import {
  Search,
  BookOpen,
  PlayCircle,
  Award,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const MyCourses = () => {
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [progressMap, setProgressMap] = useState({}); // Stores { courseId: [completedLessonIds] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEnrolledCoursesAndProgress();
  }, [searchTerm, selectedCategory]);

  const fetchEnrolledCoursesAndProgress = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== "All") params.category = selectedCategory;

      // 1. Fetch Enrolled Courses
      const { data } = await API.get("/my-courses", { params });
      const courseData = data?.data || data || {};

      setInProgress(Array.isArray(courseData.inProgress) ? courseData.inProgress : []);

      // 2. Fetch User Lesson Progress using /my-progress/all
      try {
        const progressRes = await API.get("/my-progress/all");

        // Exact extraction based on controller: res.json({ success: true, data: completedData })
        const progressList =
          progressRes.data?.data?.data ||
          progressRes.data?.data ||
          progressRes.data ||
          [];

          setCompleted(progressList)


        const pMap = {};
        if (Array.isArray(progressList)) {
          progressList.forEach((item) => {
            if (item.courseId) {
              pMap[item.courseId] = item.completedLessons || [];
            }
          });
        }
        setProgressMap(pMap);
      } catch (pErr) {
        console.error("Failed to load lesson progress:", pErr);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to safely resolve course details (handles raw or populated course object)
  const getCourseDetails = (item) => {
    console.log(item)
    return item?.courseId ? item : item;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-6">
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide flex items-center gap-2">
            MY COURSES <Sparkles className="w-5 h-5 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continue your learning journey and track your educational progress.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-300 font-medium focus:outline-none focus:border-amber-500 transition cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Seerah">Seerah</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Hadith">Hadith</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          <p className="text-slate-400 text-xs font-semibold">Loading enrolled courses...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-center text-red-400 text-xs font-semibold">
          {error}
        </div>
      ) : (
        <>
          {/* 2. CONTINUE LEARNING SECTION */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-amber-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Continue Learning
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {inProgress.length} Courses Active
              </span>
            </div>

            {inProgress.length === 0 ? (
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 text-center space-y-3">
                <p className="text-xs text-slate-400">No active courses found.</p>
                <Link
                  to="/courses"
                  className="inline-block text-xs font-bold text-amber-400 hover:underline"
                >
                  Explore Course Catalog →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {inProgress.map((rawItem) => {
                  const course = getCourseDetails(rawItem);

                  // Extract all lessons from course modules
                  const allLessons = course.modules
                    ? course.modules.flatMap((m) => m.lessons || [])
                    : [];
                  const totalLessons = allLessons.length;

                  // Extract user completed lessons using state map
                  const completedLessons = progressMap[course._id] || [];
                  const completedCount = completedLessons.length;

                  // Calculate percentage dynamically
                  const progressPercentage = totalLessons > 0
                    ? Math.round((completedCount / totalLessons) * 100)
                    : 0;

                  return (
                    <div
                      key={course._id || rawItem._id}
                      className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 transition group flex flex-col justify-between shadow-xl backdrop-blur-xl"
                    >
                      <div>
                        {/* Course Image */}
                        <div className="aspect-video bg-slate-950 relative overflow-hidden">
                          <img
                            src={
                              course.image ||
                              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600"
                            }
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                        </div>

                        {/* Card Info */}
                        <div className="p-5 space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-white line-clamp-1">
                              {course.title}
                            </h3>
                            {course.arabicTitle && (
                              <p className="text-xs text-amber-400 font-serif font-semibold mt-0.5">
                                {course.arabicTitle}
                              </p>
                            )}
                          </div>

                          {/* Dynamic Progress Indicator */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400 text-[11px] flex items-center gap-1 font-medium">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                {completedCount}/{totalLessons} Lessons
                              </span>
                              <span className="text-amber-400 font-bold text-[11px]">
                                {progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-5 pt-0">
                        <Link
                          to={`/course/${course._id}/player`}
                          className="w-full py-2.5 px-4 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" /> Continue
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. COMPLETED COURSES SECTION */}
          <section className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed Courses
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {completed.length} Completed
              </span>
            </div>

            {completed.length === 0 ? (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6 text-center text-xs text-slate-500">
                No completed courses yet. Keep learning to earn your certificates!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completed.map((rawItem) => {
                  const course = getCourseDetails(rawItem);
                  console.log(course)
                  return (
                    <div
                      key={course.courseId || rawItem.courseId}
                      className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-5 space-y-4 hover:border-emerald-500/40 transition shadow-xl flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {course.course.courseId.title}
                          </h3>
                          {course.course.courseId.arabicTitle && (
                            <p className="text-xs text-amber-400 font-serif font-semibold mt-0.5">
                              {course.course.courseId.arabicTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-5 pt-0">
                        <Link
                          to={`/course/${course.course.courseId._id}/player`}
                          className="w-full py-2.5 px-4 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" /> Continue
                        </Link>
                      </div>

                      {/* <a
                        href={rawItem.certificateUrl || course.certificateUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                      >
                        <Award className="w-4 h-4 shrink-0" /> Certificate
                      </a> */}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MyCourses;