import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  Clock,
  PlayCircle,
  Calendar,
  Loader2,
  CheckCircle2,
  Award,
  Bell,
  Sparkles,
  FileText,
  ArrowRight,
  TrendingUp,
  Flame,
  Trophy,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user, dashboardData, fetchDashboardData } = useAuth();
  const {
    inProgressCourses,
    completedCourses,
    upcomingLiveClass,
    announcements,
    tasks,
    loading,
    error,
  } = dashboardData;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Direct Auth User Model Se XP aur Streak read karein
  const totalXp = user?.xp ?? user?.totalXp ?? 0;
  const currentStreak = user?.streak ?? 1;

  // Dynamic Level calculation logic
  const level = Math.floor(totalXp / 500) + 1;
  const xpForNextLevel = level * 500;
  const currentLevelXP = totalXp % 500;
  const xpPercentage = Math.min((currentLevelXP / 500) * 100, 100);

  const isClassActive = (classObj) => {
    if (!classObj || !classObj.date) return false;
    try {
      const classDateTime = new Date(classObj.date);
      return classDateTime > new Date();
    } catch {
      return false;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-50 text-emerald-600 font-sans">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs text-slate-500 font-semibold">
          Loading Student Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* 1. LATEST GRADIENT HEADER WITH LEVEL & XP TRACKER */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-semibold mb-1 text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Level {level} Scholar</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                Assalamu Alaikum, {user?.name || "Student"}! 👋
              </h1>
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 font-medium">
                Ready to continue your learning journey today?
              </p>
            </div>
          </div>

          {/* XP & Streak Widget */}
          <div className="flex items-center gap-4 bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
            <div className="text-center px-2">
              <div className="flex items-center gap-1.5 text-amber-300 font-black text-xl">
                <Trophy className="w-5 h-5 shrink-0" />
                <span>{totalXp.toLocaleString()}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                Total XP
              </span>
            </div>

            <div className="h-8 w-[1px] bg-white/20" />

            <div className="text-center px-2">
              <div className="flex items-center gap-1.5 text-rose-300 font-black text-xl">
                <Flame className="w-5 h-5 shrink-0 fill-rose-300" />
                <span>{currentStreak}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                Day Streak
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center text-xs font-bold mb-1.5">
            <span className="text-emerald-100">Level {level} Progress</span>
            <span className="text-white/80">
              {currentLevelXP} / 500 XP ({xpForNextLevel - totalXp} XP Needed)
            </span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-amber-300 to-amber-500 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-2xl shadow-sm">
          {error}
        </div>
      )}

      {/* 2. LIVE CLASS ALERT BANNER */}
      {upcomingLiveClass && isClassActive(upcomingLiveClass) && (
        <div className="bg-gradient-to-r from-emerald-50 via-white to-amber-50 border border-emerald-200 rounded-3xl p-6 relative overflow-hidden shadow-lg shadow-slate-200/40">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-600 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Q&A Session Scheduled
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {upcomingLiveClass.title}
              </h3>
              <p className="text-xs text-slate-600">
                Course:{" "}
                <span className="text-slate-900 font-medium">
                  {upcomingLiveClass.courseName}
                </span>{" "}
                • Instructor: {upcomingLiveClass.instructor}
              </p>
              <div className="flex items-center gap-4 text-xs text-emerald-700 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />{" "}
                  {new Date(upcomingLiveClass.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />{" "}
                  {upcomingLiveClass.time}
                </span>
              </div>
            </div>

            <a
              href={upcomingLiveClass.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 shrink-0"
            >
              <Video className="w-4 h-4" /> Join Zoom Class
            </a>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT GRID (2 COLUMNS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ACTIVE COURSES & COMPLETED */}
        <div className="lg:col-span-2 space-y-8">
          {/* CONTINUE LEARNING / IN PROGRESS COURSES */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Continue Learning
              </h2>
              <Link
                to="/my-courses"
                className="text-xs text-slate-500 hover:text-emerald-600 transition font-semibold flex items-center gap-1"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!inProgressCourses || inProgressCourses.length === 0 ? (
              <div className="text-center py-10 bg-white border border-slate-200/80 rounded-3xl space-y-3 shadow-sm">
                <BookOpen className="w-10 h-10 mx-auto text-slate-400 stroke-1" />
                <p className="text-xs text-slate-500">
                  You have no active in-progress courses.
                </p>
                <Link
                  to="/courses"
                  className="inline-block px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition shadow-sm"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inProgressCourses.slice(0, 4).map((course) => {
                  const courseId = String(course._id || course.courseId);

                  return (
                    <div
                      key={courseId}
                      className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:border-slate-300 transition flex flex-col justify-between shadow-lg shadow-slate-200/40 group"
                    >
                      <div>
                        <div className="aspect-video bg-slate-100 relative overflow-hidden">
                          <img
                            src={
                              course.image ||
                              course.courseId?.image ||
                              "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600"
                            }
                            alt={course.title || course.courseId?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        <div className="p-5 space-y-2">
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                            {course.title ||
                              course.courseId?.title ||
                              "Untitled Course"}
                          </h3>
                          {(course.arabicTitle ||
                            course.courseId?.arabicTitle) && (
                            <p className="text-xs text-emerald-600 font-serif font-semibold">
                              {course.arabicTitle ||
                                course.courseId?.arabicTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <Link
                          to={`/course/${courseId}/player`}
                          className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition shadow-md shadow-emerald-600/20"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" /> Resume
                          Learning
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COMPLETED COURSES SECTION */}
          {completedCourses?.length > 0 && (
            <div className="space-y-4 pt-6 border-t border-slate-200">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed Courses (
                {completedCourses.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedCourses.map((course, idx) => (
                  <div
                    key={course._id || idx}
                    className="bg-white border border-emerald-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />{" "}
                        100% Completed
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                        {course.course?.courseId?.title ||
                          course.title ||
                          "Completed Course"}
                      </h4>
                    </div>

                    <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-amber-600 text-xs font-bold rounded-lg border border-slate-200 flex items-center gap-1.5 shrink-0 transition">
                      <Award className="w-3.5 h-3.5 text-amber-500" />{" "}
                      Certificate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="space-y-6">
          {/* ANNOUNCEMENTS */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-emerald-600 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Announcements
            </h3>

            <div className="space-y-3">
              {announcements?.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No announcements right now.
                </p>
              ) : (
                announcements?.map((item, idx) => (
                  <div
                    key={item._id || item.id || idx}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 hover:border-slate-300 transition"
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-emerald-600 font-bold uppercase">
                        {item.category || "General"}
                      </span>
                      <span className="text-slate-400">
                        {formatDate(item.createdAt || item.date)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {item.title}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* UPCOMING DEADLINES / TASKS */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" /> Pending Tasks
            </h3>

            <div className="space-y-3">
              {tasks?.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">
                  No pending tasks!
                </p>
              ) : (
                tasks?.map((task, idx) => (
                  <div
                    key={task._id || task.id || idx}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3 hover:border-slate-300 transition"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        {task.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Due: {formatDate(task.dueDate || task.date)}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-md font-bold shrink-0 border ${
                        task.type?.toLowerCase() === "quiz"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-indigo-50 text-indigo-700 border-indigo-200"
                      }`}
                    >
                      {task.type || "Assignment"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK RESOURCES */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-slate-50 border border-emerald-100 rounded-3xl p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-emerald-700 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" /> Quick
              Resources
            </h3>
            <p className="text-xs text-slate-500">
              Access course materials, notes, and community discussions.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline pt-1"
            >
              Browse All Courses →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;