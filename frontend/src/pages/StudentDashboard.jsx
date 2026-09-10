import { useState, useEffect } from "react";
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
} from "lucide-react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

// Dummy Fallback Data
const DUMMY_ANNOUNCEMENTS = [
  {
    _id: "ann_1",
    title: "Mid-Term Evaluation Schedule Released",
    createdAt: "2026-09-10",
    category: "Exam Alert",
  },
  {
    _id: "ann_2",
    title: "New Tajweed Advanced Module Added",
    createdAt: "2026-09-08",
    category: "Course Update",
  },
];

const DUMMY_TASKS = [
  {
    _id: "tsk_1",
    title: "Tajweed Recitation Submission",
    dueDate: "2026-09-14",
    type: "Quiz",
  },
  {
    _id: "tsk_2",
    title: "Seerah Assignment #2",
    dueDate: "2026-09-18",
    type: "Assignment",
  },
];

const StudentDashboard = () => {
  const { user } = useAuth();
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [upcomingLiveClass, setUpcomingLiveClass] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Courses, Progress, Announcements & Tasks in Parallel
      const [coursesRes, progressRes, annRes, tasksRes] = await Promise.allSettled([
        API.get("/my-courses"),
        API.get("/my-progress/all"),
        API.get("/announcements"),
        API.get("/tasks"), // ya "/assignments" endpoint
      ]);

      // Handle Courses
      let rawCourses = [];
      if (coursesRes.status === "fulfilled") {
        const cData = coursesRes.value.data?.data || coursesRes.value.data || [];
        rawCourses = Array.isArray(cData) ? cData : [...(cData.inProgress || []), ...(cData.completed || [])];
      }

      // Handle Progress
      let progressData = [];
      if (progressRes.status === "fulfilled") {
        progressData = progressRes.value.data?.data || progressRes.value.data || [];
      }
      setCompletedCourses(progressData)

      const progressMap = {};
      if (Array.isArray(progressData)) {
        progressData.forEach((p) => {
          const cId = p.courseId?._id || p.courseId || p.course;
          if (cId) {
            progressMap[String(cId)] = p;
          }
        });
      }

      const inProgress = [];
      const completed = [];

      rawCourses.forEach((item) => {
        const courseObj = item.courseId && typeof item.courseId === "object" ? item.courseId : (item.course || item);
        const cId = String(courseObj._id || item._id || item.courseId);

        const prog = progressMap[cId];
        const isCompleted = item.isCompleted || prog?.isCompleted || (prog?.percentage >= 100);

        const mergedCourse = {
          ...courseObj,
          progressPercentage: prog?.percentage || item.progress || 0,
          isCompleted: Boolean(isCompleted),
        };

        if (isCompleted) {
          completed.push(mergedCourse);
        } else {
          inProgress.push(mergedCourse);
        }
      });

      setInProgressCourses(inProgress);
      // setCompletedCourses(completed);

      // Handle Announcements (Backend or Fallback)
      if (annRes.status === "fulfilled") {
        const annData = annRes.value.data?.data || annRes.value.data || [];
        setAnnouncements(Array.isArray(annData) && annData.length > 0 ? annData : DUMMY_ANNOUNCEMENTS);
      } else {
        setAnnouncements(DUMMY_ANNOUNCEMENTS);
      }

      // Handle Tasks (Backend or Fallback)
      if (tasksRes.status === "fulfilled") {
        const taskData = tasksRes.value.data?.data || tasksRes.value.data || [];
        setTasks(Array.isArray(taskData) && taskData.length > 0 ? taskData : DUMMY_TASKS);
      } else {
        setTasks(DUMMY_TASKS);
      }

      // 2. Fetch Live Sessions
      try {
        const liveRes = await API.get("/live-sessions");
        const sessions = Array.isArray(liveRes.data)
          ? liveRes.data
          : liveRes.data?.sessions || [];

        if (sessions.length > 0) {
          const activeSession = sessions[0];
          setUpcomingLiveClass({
            id: activeSession._id,
            title: activeSession.title,
            courseName: activeSession.course?.title || "Islamic Studies",
            instructor: activeSession.scholarName || activeSession.instructor,
            date: activeSession.scheduledAt,
            time: new Date(activeSession.scheduledAt).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            meetingLink: activeSession.meetingUrl,
          });
        }
      } catch {
        setUpcomingLiveClass({
          id: "lc101",
          title: "Seerah Q&A & Open Discussion",
          courseName: "Seerah of Prophet Muhammad ﷺ",
          instructor: "Sheikh Abdul Rahman",
          date: "2026-09-15",
          time: "8:00 PM PKT",
          meetingLink: "https://zoom.us/j/example123456",
        });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

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
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-950 text-amber-400">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs text-slate-400 font-semibold">Loading Student Portal...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-slate-950 min-h-screen text-slate-100">
      
      {/* 1. WELCOME & STATS OVERVIEW BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/20 border border-slate-800/80 p-6 rounded-3xl shadow-xl backdrop-blur-xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold tracking-wide uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Student Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assalamu Alaikum, <span className="text-amber-400">{user?.name || "Student"}</span> 👋
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Welcome back to your learning space. Keep building your sacred knowledge.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full lg:w-auto">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl text-center">
            <span className="block text-[10px] uppercase font-semibold text-slate-400">In Progress</span>
            <span className="text-xl font-black text-white">{inProgressCourses.length}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl text-center">
            <span className="block text-[10px] uppercase font-semibold text-slate-400">Completed</span>
            <span className="text-xl font-black text-emerald-400">{completedCourses.length}</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl text-center">
            <span className="block text-[10px] uppercase font-semibold text-slate-400">Tasks</span>
            <span className="text-xl font-black text-amber-400">{tasks.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-2xl">
          {error}
        </div>
      )}

      {/* 2. LIVE CLASS ALERT BANNER */}
      {upcomingLiveClass && isClassActive(upcomingLiveClass) && (
        <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-amber-950/40 border border-emerald-500/30 rounded-3xl p-6 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Q&A Session Scheduled
              </div>
              <h3 className="text-xl font-bold text-white">{upcomingLiveClass.title}</h3>
              <p className="text-xs text-slate-400">
                Course: <span className="text-slate-200 font-medium">{upcomingLiveClass.courseName}</span> • Instructor: {upcomingLiveClass.instructor}
              </p>
              <div className="flex items-center gap-4 text-xs text-amber-400 font-medium pt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {new Date(upcomingLiveClass.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {upcomingLiveClass.time}
                </span>
              </div>
            </div>

            <a
              href={upcomingLiveClass.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 shrink-0"
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
              <h2 className="text-sm font-extrabold tracking-widest uppercase text-amber-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Continue Learning
              </h2>
              <Link to="/my-courses" className="text-xs text-slate-400 hover:text-amber-400 transition font-semibold flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {inProgressCourses.length === 0 ? (
              <div className="text-center py-10 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
                <p className="text-xs text-slate-400">You have no active in-progress courses.</p>
                <Link
                  to="/courses"
                  className="inline-block px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl hover:bg-amber-400 transition"
                >
                  Explore Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {inProgressCourses.slice(0, 4).map((course) => {
                  const courseId = String(course._id);

                  return (
                    <div
                      key={courseId}
                      className="bg-slate-900/80 border border-slate-800/80 rounded-3xl overflow-hidden hover:border-slate-700 transition flex flex-col justify-between shadow-xl backdrop-blur-xl group"
                    >
                      <div>
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

                        <div className="p-5 space-y-3">
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {course.title || "Untitled Course"}
                          </h3>
                          {course.arabicTitle && (
                            <p className="text-xs text-amber-400 font-serif font-semibold">
                              {course.arabicTitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <Link
                          to={`/course/${courseId}/player`}
                          className="w-full py-2.5 px-4 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                        >
                          <PlayCircle className="w-4 h-4 shrink-0" /> Resume Learning
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* COMPLETED COURSES SECTION */}
          {completedCourses.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-800/80">
              <h2 className="text-sm font-extrabold tracking-widest uppercase text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Completed Courses ({completedCourses.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-slate-900/40 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 100% Completed
                      </span>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {course.title || "Completed Course"}
                      </h4>
                    </div>

                    <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 shrink-0 transition">
                      <Award className="w-3.5 h-3.5" /> Certificate
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
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-amber-400 flex items-center gap-2">
              <Bell className="w-4 h-4" /> Announcements
            </h3>

            <div className="space-y-3">
              {announcements.map((item, idx) => (
                <div
                  key={item._id || item.id || idx}
                  className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1 hover:border-slate-700 transition"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-amber-400 font-bold uppercase">
                      {item.category || "General"}
                    </span>
                    <span className="text-slate-500">{formatDate(item.createdAt || item.date)}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-200">{item.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* UPCOMING DEADLINES / TASKS */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" /> Pending Tasks
            </h3>

            <div className="space-y-3">
              {tasks.map((task, idx) => (
                <div
                  key={task._id || task.id || idx}
                  className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                >
                  <div>
                    <h4 className="text-xs font-bold text-white">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Due: {formatDate(task.dueDate || task.date)}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-1 rounded-md font-bold shrink-0 border ${
                      task.type?.toLowerCase() === "quiz"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    }`}
                  >
                    {task.type || "Assignment"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK RESOURCES */}
          <div className="bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/20 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-extrabold tracking-widest uppercase text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> Quick Resources
            </h3>
            <p className="text-xs text-slate-400">
              Access course materials, notes, and community discussions.
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:underline pt-1"
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