import { useState, useEffect } from "react";
import API from "../api/axiosInstance";
import {
  Plus,
  BookOpen,
  Video,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
  ExternalLink,
  Trash2,
  X,
  CheckSquare,
  Megaphone,
} from "lucide-react";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Real Database States
  const [stats, setStats] = useState({
    students: 0,
    coursesCount: 0,
    // enrollments: 0,
    revenue: "Rs. 0",
  });

  // Modals Visibility
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLiveModal, setShowLiveModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  // Forms State
  const [courseForm, setCourseForm] = useState({
    title: "",
    arabicTitle: "",
    category: "Seerah",
    instructor: "",
    description: "",
    image: "",
    price: 0,
  });

  const [liveForm, setLiveForm] = useState({
    title: "",
    course: "",
    scholarName: "",
    meetingUrl: "",
    scheduledAt: "",
  });

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedTo: "",
  });

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "Normal",
  });

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load Real Data from Backend APIs
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, coursesRes, sessionsRes, tasksRes, announcementsRes] = await Promise.all([
        API.get("/admin/stats").catch(() => ({ data: null })),
        API.get("/courses").catch(() => ({ data: [] })),
        API.get("/live-sessions").catch(() => ({ data: [] })),
        API.get("/tasks").catch(() => ({ data: [] })),
        API.get("/announcements").catch(() => ({ data: [] })),
      ]);

      if (statsRes.data) {
        console.log(statsRes.data)
        setStats(statsRes.data.stats || {});
      }

      // Safe normalization
      setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : coursesRes.data?.courses || []);
      setLiveSessions(Array.isArray(sessionsRes.data) ? sessionsRes.data : sessionsRes.data?.sessions || []);
      setTasks(Array.isArray(tasksRes.data) ? tasksRes.data : tasksRes.data?.tasks || []);
      setAnnouncements(Array.isArray(announcementsRes.data) ? announcementsRes.data : announcementsRes.data?.announcements || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  // Handlers for Course & Live Classes
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/courses", courseForm);
      setMessage({ type: "success", text: "Course published successfully!" });
      setShowCourseModal(false);
      setCourseForm({ title: "", arabicTitle: "", category: "Seerah", instructor: "", description: "", image: "", price: 0 });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to publish course." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLiveSession = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/live-sessions", liveForm);
      setMessage({ type: "success", text: "Live session scheduled successfully!" });
      setShowLiveModal(false);
      setLiveForm({ title: "", course: "", scholarName: "", meetingUrl: "", scheduledAt: "" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to schedule live session." });
    } finally {
      setSubmitting(false);
    }
  };

  // Handlers for Task & Announcement
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/tasks", taskForm);
      setMessage({ type: "success", text: "Task created successfully!" });
      setShowTaskModal(false);
      setTaskForm({ title: "", description: "", dueDate: "", assignedTo: "" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to create task." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setMessage({ type: "", text: "" });
      await API.post("/announcements", announcementForm);
      setMessage({ type: "success", text: "Announcement posted successfully!" });
      setShowAnnouncementModal(false);
      setAnnouncementForm({ title: "", content: "", priority: "Normal" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to post announcement." });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Actions
  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${id}`);
      setMessage({ type: "success", text: "Course deleted successfully!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete course." });
    }
  };

  const handleDeleteLiveSession = async (id) => {
    if (!window.confirm("Are you sure you want to delete this session?")) return;
    try {
      await API.delete(`/live-sessions/${id}`);
      setMessage({ type: "success", text: "Live session deleted successfully!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to delete live session." });
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setMessage({ type: "success", text: "Task removed!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete task." });
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await API.delete(`/announcements/${id}`);
      setMessage({ type: "success", text: "Announcement removed!" });
      fetchData();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete announcement." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-islamic-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8 bg-islamic-bg min-h-screen text-islamic-text">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-islamic-border pb-6">
        <div>
          <span className="font-arabic text-2xl text-islamic-gold font-bold">
            لوحة التحكم
          </span>
          <h1 className="text-3xl font-extrabold text-islamic-text">
            Admin Management Portal
          </h1>
          <p className="text-xs text-islamic-muted">
            Live stats & management controls synced with MongoDB database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowCourseModal(true)}
            className="px-3.5 py-2 rounded-xl bg-islamic-primary hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
          <button
            onClick={() => setShowLiveModal(true)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Video className="w-4 h-4" /> Live Class
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="px-3.5 py-2 rounded-xl bg-islamic-gold hover:opacity-90 text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <CheckSquare className="w-4 h-4" /> New Task
          </button>
          <button
            onClick={() => setShowAnnouncementModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
          >
            <Megaphone className="w-4 h-4" /> Announcement
          </button>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 text-xs rounded-xl font-semibold border ${message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* TOP STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-islamic-card border border-islamic-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-islamic-muted">Total Students</p>
            <h2 className="text-2xl font-black text-islamic-text mt-1">
              {stats.students || 0}
            </h2>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-islamic-primary">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-islamic-card border border-islamic-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-islamic-muted">Active Courses</p>
            <h2 className="text-2xl font-black text-islamic-text mt-1">
              {courses.length}
            </h2>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-islamic-gold">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-islamic-card border border-islamic-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-islamic-muted">Pending Tasks</p>
            <h2 className="text-2xl font-black text-islamic-text mt-1">
              {stats.tasks || 0}
            </h2>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        {/* Live Sessions */}
        <div className="bg-islamic-card border border-islamic-border p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-islamic-muted">Live Broadcasts</p>
            <h2 className="text-2xl font-black text-islamic-text mt-1">
              {stats.liveSessions || 0}
            </h2>
          </div>
          <div className="p-3 bg-red-500/10 rounded-xl text-red-500">
            <Video className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-islamic-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "overview"
              ? "border-islamic-primary text-islamic-primary"
              : "border-transparent text-islamic-muted hover:text-islamic-text"
            }`}
        >
          <TrendingUp className="w-4 h-4" /> Overview & Operations
        </button>
        <button
          onClick={() => setActiveTab("courses")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "courses"
              ? "border-islamic-primary text-islamic-primary"
              : "border-transparent text-islamic-muted hover:text-islamic-text"
            }`}
        >
          <BookOpen className="w-4 h-4" /> Courses Catalog ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab("live")}
          className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-2 ${activeTab === "live"
              ? "border-red-500 text-red-500"
              : "border-transparent text-islamic-muted hover:text-islamic-text"
            }`}
        >
          <Video className="w-4 h-4" /> Live Broadcasts ({liveSessions.length})
        </button>
      </div>

      {/* OVERVIEW TAB (TASKS + ANNOUNCEMENTS + LIVE SESSIONS) */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Task Management Section */}
            <div className="bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-islamic-border pb-3">
                <h3 className="text-sm font-bold text-islamic-text flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-islamic-gold" /> Admin Tasks
                </h3>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="text-xs text-islamic-gold hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Create Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <p className="text-xs text-islamic-muted py-6 text-center">
                  No active tasks found.
                </p>
              ) : (
                <div className="divide-y divide-islamic-border space-y-1">
                  {tasks.map((task) => (
                    <div key={task._id} className="pt-3 pb-2 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <h4 className="font-bold text-islamic-text">{task.title}</h4>
                        <p className="text-islamic-muted text-[11px] line-clamp-2">{task.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-islamic-gold pt-1">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.assignedTo && <span>Assigned: {task.assignedTo}</span>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Announcements Section */}
            <div className="bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-islamic-border pb-3">
                <h3 className="text-sm font-bold text-islamic-text flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-islamic-gold" /> Global Announcements
                </h3>
                <button
                  onClick={() => setShowAnnouncementModal(true)}
                  className="text-xs text-islamic-gold hover:underline font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Post Announcement
                </button>
              </div>

              {announcements.length === 0 ? (
                <p className="text-xs text-islamic-muted py-6 text-center">
                  No announcements published.
                </p>
              ) : (
                <div className="divide-y divide-islamic-border space-y-1">
                  {announcements.map((ann) => (
                    <div key={ann._id} className="pt-3 pb-2 flex items-start justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-islamic-text">{ann.title}</h4>
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${ann.priority === "High"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-islamic-gold/20 text-islamic-gold"
                            }`}>
                            {ann.priority || "Normal"}
                          </span>
                        </div>
                        <p className="text-islamic-muted text-[11px] line-clamp-2">{ann.content}</p>
                        <p className="text-[10px] text-islamic-muted pt-1">
                          {new Date(ann.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann._id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Live Classes Quick Overview */}
          <div className="bg-islamic-card border border-islamic-border rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-islamic-text border-b border-islamic-border pb-3 flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" /> Scheduled Live Classes
            </h3>
            {liveSessions.length === 0 ? (
              <p className="text-xs text-islamic-muted py-4">No live sessions scheduled.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {liveSessions.slice(0, 3).map((ls) => (
                  <div
                    key={ls._id}
                    className="p-4 bg-islamic-bg rounded-xl border border-islamic-border flex flex-col justify-between text-xs space-y-3"
                  >
                    <div>
                      <p className="font-bold text-islamic-text">{ls.title}</p>
                      <p className="text-[11px] text-islamic-gold mt-0.5">Scholar: {ls.scholarName}</p>
                      <p className="text-[10px] text-islamic-muted flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" /> {new Date(ls.scheduledAt).toLocaleString()}
                      </p>
                    </div>
                    <a
                      href={ls.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700 text-center transition"
                    >
                      Join Class
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === "courses" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-islamic-text">All Courses Catalog</h3>
            <button
              onClick={() => setShowCourseModal(true)}
              className="px-3.5 py-2 rounded-xl bg-islamic-primary text-white text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 text-center bg-islamic-card border border-islamic-border rounded-2xl text-islamic-muted text-xs">
              No courses found in database.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((c) => (
                <div
                  key={c._id}
                  className="bg-islamic-card border border-islamic-border rounded-2xl overflow-hidden shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <img
                    src={c.image || "https://images.unsplash.com/photo-1542816417-0983cbe82752?auto=format&fit=crop&q=80"}
                    alt={c.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-islamic-gold uppercase tracking-wider">
                          {c.category || "Seerah"}
                        </span>
                        <span className="text-xs font-bold text-islamic-primary">
                          Rs. {c.price || 0}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-islamic-text mt-1">{c.title}</h4>
                      <p className="text-xs text-islamic-muted font-arabic">{c.arabicTitle}</p>
                      <p className="text-xs text-islamic-muted line-clamp-2 mt-2">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-islamic-border flex items-center justify-between text-xs">
                      <span className="text-islamic-muted text-[11px]">By {c.instructor}</span>
                      <button
                        onClick={() => handleDeleteCourse(c._id)}
                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LIVE BROADCASTS TAB */}
      {activeTab === "live" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-islamic-text">Live Classes Schedule</h3>
            <button
              onClick={() => setShowLiveModal(true)}
              className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center gap-2"
            >
              <Video className="w-4 h-4" /> Schedule Session
            </button>
          </div>

          {liveSessions.length === 0 ? (
            <div className="p-8 text-center bg-islamic-card border border-islamic-border rounded-2xl text-islamic-muted text-xs">
              No live classes scheduled.
            </div>
          ) : (
            <div className="divide-y divide-islamic-border bg-islamic-card border border-islamic-border rounded-2xl overflow-hidden">
              {liveSessions.map((session) => (
                <div
                  key={session._id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-islamic-text">{session.title}</h4>
                    <p className="text-xs text-islamic-gold">Scholar: {session.scholarName}</p>
                    <p className="text-[11px] text-islamic-muted flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.scheduledAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                    >
                      Join Meeting <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteLiveSession(session._id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal 1: Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-islamic-card border border-islamic-border rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative text-islamic-text">
            <div className="flex items-center justify-between border-b border-islamic-border pb-4">
              <h2 className="text-lg font-bold">Publish New Course</h2>
              <button onClick={() => setShowCourseModal(false)} className="p-1 text-islamic-muted hover:text-islamic-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="text"
                required
                placeholder="Arabic Title"
                value={courseForm.arabicTitle}
                onChange={(e) => setCourseForm({ ...courseForm, arabicTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text font-arabic focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="text"
                required
                placeholder="Instructor Name"
                value={courseForm.instructor}
                onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="url"
                required
                placeholder="Cover Image URL"
                value={courseForm.image}
                onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <textarea
                rows={3}
                required
                placeholder="Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="px-4 py-2 text-xs font-bold text-islamic-muted">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-islamic-primary text-white rounded-xl text-xs font-bold">
                  {submitting ? "Publishing..." : "Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Live Class Modal */}
      {showLiveModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-islamic-card border border-islamic-border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-islamic-text">
            <div className="flex items-center justify-between border-b border-islamic-border pb-4">
              <h2 className="text-lg font-bold">Schedule Live Class</h2>
              <button onClick={() => setShowLiveModal(false)} className="p-1 text-islamic-muted hover:text-islamic-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLiveSession} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Session Title"
                value={liveForm.title}
                onChange={(e) => setLiveForm({ ...liveForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <select
                required
                value={liveForm.course}
                onChange={(e) => setLiveForm({ ...liveForm, course: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              >
                <option value="">-- Choose Course --</option>
                {courses.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                placeholder="Scholar Name"
                value={liveForm.scholarName}
                onChange={(e) => setLiveForm({ ...liveForm, scholarName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="url"
                required
                placeholder="Meeting URL"
                value={liveForm.meetingUrl}
                onChange={(e) => setLiveForm({ ...liveForm, meetingUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="datetime-local"
                required
                value={liveForm.scheduledAt}
                onChange={(e) => setLiveForm({ ...liveForm, scheduledAt: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowLiveModal(false)} className="px-4 py-2 text-xs font-bold text-islamic-muted">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-red-600 text-white rounded-xl text-xs font-bold">
                  {submitting ? "Scheduling..." : "Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-islamic-card border border-islamic-border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-islamic-text">
            <div className="flex items-center justify-between border-b border-islamic-border pb-4">
              <h2 className="text-lg font-bold">Create New Admin Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-1 text-islamic-muted hover:text-islamic-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Task Title"
                value={taskForm.title}
                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <textarea
                rows={3}
                required
                placeholder="Task Description"
                value={taskForm.description}
                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="date"
                value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <input
                type="text"
                placeholder="Assigned To (Optional)"
                value={taskForm.assignedTo}
                onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-xs font-bold text-islamic-muted">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-islamic-gold text-slate-900 rounded-xl text-xs font-bold">
                  {submitting ? "Saving..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Announcement Modal */}
      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-islamic-card border border-islamic-border rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative text-islamic-text">
            <div className="flex items-center justify-between border-b border-islamic-border pb-4">
              <h2 className="text-lg font-bold">Post Global Announcement</h2>
              <button onClick={() => setShowAnnouncementModal(false)} className="p-1 text-islamic-muted hover:text-islamic-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Announcement Title"
                value={announcementForm.title}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <textarea
                rows={4}
                required
                placeholder="Announcement Content"
                value={announcementForm.content}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              />
              <select
                value={announcementForm.priority}
                onChange={(e) => setAnnouncementForm({ ...announcementForm, priority: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-islamic-border bg-islamic-bg text-xs text-islamic-text focus:outline-none focus:border-islamic-gold"
              >
                <option value="Normal">Normal Priority</option>
                <option value="High">High Priority</option>
              </select>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAnnouncementModal(false)} className="px-4 py-2 text-xs font-bold text-islamic-muted">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="px-5 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold">
                  {submitting ? "Posting..." : "Post Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;