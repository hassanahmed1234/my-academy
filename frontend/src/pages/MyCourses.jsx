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
} from "lucide-react";

const MyCourses = () => {
  const [inProgress, setInProgress] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchEnrolledCourses();
  }, [searchTerm, selectedCategory]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedCategory !== "All") params.category = selectedCategory;

      const { data } = await API.get("/my-courses", { params });
      console.log(data.data.inProgress)
      setInProgress(data.data.inProgress || []);
      setCompleted(data.data.completed || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your courses.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
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
          {/* Search Box */}
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
              <span className="text-xs text-slate-500 font-medium">{inProgress.length} Courses Active</span>
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
                {inProgress.map((item) => (
                  <div
                    key={item._id}
                    className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 transition group flex flex-col justify-between shadow-xl backdrop-blur-xl"
                  >
                    <div>
                      {/* Course Thumbnail */}
                      <div className="aspect-video bg-slate-950 relative overflow-hidden">
                        <img
                          src={item.image || "/api/placeholder/400/225"}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                      </div>

                      {/* Course Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {item.title}
                          </h3>
                          {item.arabicTitle && (
                            <p className="text-xs text-amber-400 font-serif font-semibold mt-0.5">
                              {item.arabicTitle}
                            </p>
                          )}
                        </div>

                        {/* Progress Bar & Percentage */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center text-[11px] font-semibold">
                            <span className="text-slate-400">Progress</span>
                            <span className="text-amber-400 font-bold">{item.progressPercentage}%</span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-gradient-to-r from-amber-500 to-amber-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${item.progressPercentage}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium text-right">
                            {item.completedLessons?.length || 0} / {item.totalLessons} lessons
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="p-5 pt-0">
                      <Link
                        to={`/course/${item._id}/player`}
                        className="w-full py-2.5 px-4 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                      >
                        <PlayCircle className="w-4 h-4 shrink-0" /> Continue
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. COMPLETED COURSES SECTION */}
          <section className="space-y-5 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed Courses
              </h2>
              <span className="text-xs text-slate-500 font-medium">{completed.length} Completed</span>
            </div>

            {completed.length === 0 ? (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-3xl p-6 text-center text-xs text-slate-500">
                No completed courses yet. Keep learning to earn your certificates!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completed.map((item) => (
                  <div
                    key={item._id}
                    className="bg-slate-900/60 border border-emerald-500/20 rounded-3xl p-5 space-y-4 hover:border-emerald-500/40 transition shadow-xl flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white line-clamp-1">{item.course?.title}</h3>
                        {item.course?.arabicTitle && (
                          <p className="text-xs text-amber-400 font-serif font-semibold mt-0.5">
                            {item.course?.arabicTitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Certificate Action */}
                    <a
                      href={item.certificateUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition"
                    >
                      <Award className="w-4 h-4 shrink-0" /> Certificate
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default MyCourses;