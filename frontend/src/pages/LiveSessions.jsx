import React, { useState, useEffect } from "react";
import API from "../api/axiosInstance"; // Path update karein aapke axios instance setup ke mutabiq
import {
  Video,
  Calendar,
  Clock,
  User,
  BookOpen,
  Search,
  Bell,
  BellCheck,
  ExternalLink,
  ChevronRight,
  Radio,
  CheckCircle2,
  CalendarDays,
  CalendarPlus,
  Loader2,
  AlertCircle,
} from "lucide-react";

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reminders, setReminders] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // Fetch Live Sessions from Backend API
  const fetchLiveSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await API.get("/live-sessions");
      setSessions(res.data || []);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError(err.response?.data?.message || "Failed to load live sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveSessions();
  }, []);

  const toggleReminder = (id) => {
    setReminders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Helper session extractors
  const liveSession = sessions.find((s) => s.status === "Live");
  const upcomingSessions = sessions.filter((s) => s.status === "Scheduled");
  const nextSession = upcomingSessions[0];
  const pastSessions = sessions.filter((s) => s.status === "Completed");

  // Dynamic Filtering Logic
  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.scholarName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCourse =
      courseFilter === "all" || session.course?._id === courseFilter;

    const matchesStatus =
      statusFilter === "all" || session.status === statusFilter;

    return matchesSearch && matchesCourse && matchesStatus;
  });

  // Extract Unique Courses for Dropdown Filter
  const uniqueCourses = Array.from(
    new Set(
      sessions
        .map((s) => s.course)
        .filter(Boolean)
        .map((c) => JSON.stringify({ id: c._id, title: c.title }))
    )
  ).map((str) => JSON.parse(str));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3 text-slate-600">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-xs font-semibold">Loading Live Classrooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-20 pb-20 relative overflow-hidden font-sans">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-b from-emerald-100/60 via-amber-100/40 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Error Notification Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. HERO HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-emerald-800 text-xs font-semibold shadow-sm">
            <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Interactive Live Classroom</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Live Learning <span className="text-amber-600">Hub</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Learn directly from qualified scholars through real-time interactive video classes, Q&A sessions, and guided study.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {liveSession ? (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-1.5 rounded-xl text-xs font-bold animate-pulse shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                <span>🔴 SESSION LIVE NOW</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-xl text-xs font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>🟢 All Broadcasters Ready</span>
              </div>
            )}

            <div className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs shadow-sm">
              📅 {upcomingSessions.length} Upcoming
            </div>
            <div className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl text-xs shadow-sm">
              ✓ {pastSessions.length} Completed
            </div>
          </div>
        </div>

        {/* 2. LIVE NOW FEATURED BANNER */}
        {liveSession && (
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-50 via-white to-emerald-50 border-2 border-red-200 p-6 sm:p-8 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="bg-red-600 text-white text-[10px] uppercase font-black px-3 py-1 rounded-full tracking-wider animate-pulse flex items-center gap-1.5 shadow-md">
                    <Radio className="w-3.5 h-3.5" /> LIVE NOW
                  </span>
                  <span className="text-slate-500 text-xs flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Broadcast Active
                  </span>
                </div>

                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    {liveSession.title}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700 pt-1">
                  <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>{liveSession.scholarName}</span>
                  </div>
                  {liveSession.course && (
                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{liveSession.course.title}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-4 flex flex-col justify-center items-stretch md:items-end gap-3">
                <a
                  href={liveSession.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-200 active:scale-95 transition-all text-center"
                >
                  <Video className="w-4 h-4 animate-bounce" />
                  <span>Join Live Classroom</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* 3. NEXT UPCOMING FEATURED SESSION */}
        {!liveSession && nextSession && (
          <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-amber-50/50 border border-amber-300/60 p-6 sm:p-8 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-100/80 border border-amber-300 px-3 py-1 rounded-md">
                  ⭐ Next Scheduled Session
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {nextSession.title}
                  </h3>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-700 pt-2">
                    <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                      <User className="w-3.5 h-3.5 text-amber-600" />
                      {nextSession.scholarName}
                    </span>
                    {nextSession.course && (
                      <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                        {nextSession.course.title}
                      </span>
                    )}
                  </div>
                </div>

                <div className="md:col-span-5 bg-white border border-emerald-200/80 rounded-2xl p-4 text-center space-y-3 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Scheduled At
                  </div>
                  <div className="text-sm font-extrabold text-slate-800">
                    {new Date(nextSession.scheduledAt).toLocaleString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => toggleReminder(nextSession._id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        reminders[nextSession._id]
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {reminders[nextSession._id] ? (
                        <>
                          <BellCheck className="w-3.5 h-3.5 text-amber-300" />
                          <span>Reminder Set</span>
                        </>
                      ) : (
                        <>
                          <Bell className="w-3.5 h-3.5 text-amber-600" />
                          <span>Remind Me</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TABS & SEARCH TOOLBAR */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/50 shrink-0">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "all"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                All Sessions
              </button>
              <button
                onClick={() => setActiveTab("calendar")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === "calendar"
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📅 Calendar View
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sessions or scholars..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-amber-500 shadow-sm"
                />
              </div>

              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 shadow-sm"
              >
                <option value="all">All Courses</option>
                {uniqueCourses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 outline-none focus:border-amber-500 shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Live">Live</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. SESSIONS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-amber-600">•</span> Scheduled Classes
            </h2>
            <span className="text-xs text-slate-500">
              Showing {filteredSessions.length} total sessions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="group bg-white border border-slate-200 hover:border-amber-400 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    {session.course?.image ? (
                      <img
                        src={session.course.image}
                        alt={session.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center text-amber-700 font-bold text-sm">
                        {session.course?.title || "Classroom"}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                    <span className="absolute top-3 right-3 bg-white/90 border border-slate-200 text-slate-700 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {session.status}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    {session.course && (
                      <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                        {session.course.title}
                      </div>
                    )}

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2">
                      {session.title}
                    </h3>

                    <div className="space-y-2 pt-1 text-xs text-slate-600 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{session.scholarName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {new Date(session.scheduledAt).toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>
                          {new Date(session.scheduledAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center gap-2">
                  {session.status === "Live" || session.status === "Scheduled" ? (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-extrabold rounded-xl text-xs transition-all text-center flex items-center justify-center gap-1"
                    >
                      <span>Join Class</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 bg-slate-100 text-slate-400 font-bold rounded-xl text-xs text-center cursor-not-allowed"
                    >
                      {session.status}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessions;