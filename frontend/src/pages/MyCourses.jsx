import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const MyCourses = () => {
  const { myCoursesData, fetchMyCourses } = useAuth();
  const { inProgress, completed, loading, error } = myCoursesData;

  // Search & Category Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMyCourses();
  }, [fetchMyCourses]);

  // Helper to safely extract target course object
  const getCourseDetails = (item) => {
    if (item?.courseId && typeof item.courseId === "object") return item.courseId;
    if (item?.course && typeof item.course === "object") {
      return item.course.courseId && typeof item.course.courseId === "object"
        ? item.course.courseId
        : item.course;
    }
    return item;
  };

  // Client-Side Filter Function
  const filterCourses = (list) => {
    return list.filter((item) => {
      const course = getCourseDetails(item);
      const title = (course.title || "").toLowerCase();
      const arabicTitle = (course.arabicTitle || "").toLowerCase();
      const category = course.category || item.category || "";

      const matchesSearch =
        !searchTerm.trim() ||
        title.includes(searchTerm.toLowerCase().trim()) ||
        arabicTitle.includes(searchTerm.toLowerCase().trim());

      const matchesCategory =
        selectedCategory === "All" ||
        category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  };

  const filteredInProgress = useMemo(() => filterCourses(inProgress), [inProgress, searchTerm, selectedCategory]);
  const filteredCompleted = useMemo(() => filterCourses(completed), [completed, searchTerm, selectedCategory]);

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 py-6 font-sans">
      {/* 1. HEADER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            MY COURSES <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Continue your learning journey and track your educational progress.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition shadow-sm"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-700 font-medium focus:outline-none focus:border-emerald-500 transition cursor-pointer shadow-sm"
            >
              <option value="All">All Categories</option>
              <option value="Tajweed">Tajweed</option>
              <option value="Seerah">Seerah</option>
              <option value="Fiqh">Fiqh</option>
              <option value="Hadith">Hadith</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <p className="text-slate-500 text-xs font-semibold">Loading enrolled courses...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-center text-red-600 text-xs font-semibold shadow-sm">
          {error}
        </div>
      ) : (
        <>
          {/* 2. CONTINUE LEARNING SECTION */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Continue Learning
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredInProgress.length} Courses Active
              </span>
            </div>

            {filteredInProgress.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-sm">
                <p className="text-xs text-slate-500">No active courses found.</p>
                <Link
                  to="/courses"
                  className="inline-block text-xs font-bold text-emerald-600 hover:underline"
                >
                  Explore Course Catalog →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredInProgress.map((rawItem) => {
                  const course = getCourseDetails(rawItem);
                  const courseId = String(course._id || rawItem._id || rawItem.courseId);

                  return (
                    <div
                      key={courseId}
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 hover:shadow-md transition group flex flex-col justify-between shadow-sm"
                    >
                      <div>
                        {/* Course Image */}
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                          <img
                            src={
                              course.image ||
                              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600"
                            }
                            alt={course.title || "Course"}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        {/* Card Info */}
                        <div className="p-5 space-y-4">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                              {course.title || "Untitled Course"}
                            </h3>
                            {course.arabicTitle && (
                              <p className="text-xs text-amber-600 font-serif font-semibold mt-0.5">
                                {course.arabicTitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="p-5 pt-0">
                        <Link
                          to={`/course/${courseId}/player`}
                          className="w-full py-2.5 px-4 bg-emerald-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-700 transition shadow-sm"
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
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Courses
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                {filteredCompleted.length} Completed
              </span>
            </div>

            {filteredCompleted.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center text-xs text-slate-500 shadow-sm">
                No completed courses yet. Keep learning to earn your certificates!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCompleted.map((rawItem) => {
                  const course = getCourseDetails(rawItem);
                  const courseId = String(course._id || rawItem.courseId || rawItem._id);
                  const courseTitle = course.title || course.courseId?.title || "Completed Course";
                  const arabicTitle = course.arabicTitle || course.courseId?.arabicTitle;

                  return (
                    <div
                      key={rawItem._id || courseId}
                      className="bg-white border border-emerald-200 rounded-3xl p-5 space-y-4 hover:border-emerald-300 transition shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                          </span>
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {courseTitle}
                          </h3>
                          {arabicTitle && (
                            <p className="text-xs text-amber-600 font-serif font-semibold mt-0.5">
                              {arabicTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <Link
                          to={`/course/${courseId}/player`}
                          className="w-full py-2.5 px-4 bg-slate-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition shadow-sm"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" /> Review Course
                        </Link>
                      </div>
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