import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  Clock,
  PlayCircle,
  Calendar,
  Loader2,
} from "lucide-react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState({
    inProgress: [],
    completed: [],
  });
  const [upcomingLiveClass, setUpcomingLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch courses from backend
        const coursesRes = await API.get("/my-courses");
        const courseData = coursesRes.data?.data || coursesRes.data || {};
        
        setEnrolledCourses({
          inProgress: Array.isArray(courseData.inProgress) ? courseData.inProgress : [],
          completed: Array.isArray(courseData.completed) ? courseData.completed : [],
        });

        // Fetch live sessions from backend
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
              instructor: activeSession.scholarName,
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
            date: "2026-09-12",
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

    fetchDashboardData();
  }, []);

  const isClassActive = (classObj) => {
    if (!classObj || !classObj.date) return false;
    try {
      const classDateTime = new Date(classObj.date);
      return classDateTime > new Date();
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-islamic-gold">
        <Loader2 className="w-8 h-8 animate-spin text-islamic-primary" />
      </div>
    );
  }

  const inProgressList = enrolledCourses.inProgress || [];
  const completedList = enrolledCourses.completed || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 bg-islamic-bg min-h-screen">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-islamic-card p-6 rounded-2xl border border-islamic-border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-islamic-text">
            Assalamu Alaikum, <span className="text-islamic-gold">{user?.name || "Student"}</span> 👋
          </h1>
          <p className="text-islamic-muted text-xs mt-1">
            Welcome back to your learning space. Keep building your sacred knowledge.
          </p>
        </div>
        <div className="flex items-center gap-6 bg-islamic-bg/60 px-5 py-3 rounded-xl border border-islamic-border/50 text-xs">
          <div>
            <span className="block text-islamic-muted">Enrolled Courses</span>
            <span className="text-lg font-bold text-islamic-text">{inProgressList.length}</span>
          </div>
          <div className="w-px h-8 bg-islamic-border" />
          <div>
            <span className="block text-islamic-muted">Completed Lessons</span>
            <span className="text-lg font-bold text-islamic-primary">{completedList.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Live Class Alert Banner */}
      {upcomingLiveClass && isClassActive(upcomingLiveClass) && (
        <div className="bg-gradient-to-r from-[#1A2E26] via-islamic-card to-[#23352B] border border-islamic-gold/40 rounded-2xl p-6 relative overflow-hidden shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Q&A Session Scheduled
              </div>
              <h3 className="text-xl font-bold text-islamic-text">{upcomingLiveClass.title}</h3>
              <p className="text-xs text-islamic-muted">
                Course: <span className="text-islamic-text font-medium">{upcomingLiveClass.courseName}</span> • Instructor: {upcomingLiveClass.instructor}
              </p>
              <div className="flex items-center gap-4 text-xs text-islamic-gold pt-1">
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
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-islamic-gold hover:bg-amber-600 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow"
            >
              <Video className="w-4 h-4" /> Join Zoom Class
            </a>
          </div>
        </div>
      )}

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-islamic-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-islamic-primary" /> My Courses
          </h2>
          <Link to="/courses" className="text-xs text-islamic-gold hover:underline font-semibold">
            Explore More Courses
          </Link>
        </div>

        {inProgressList.length === 0 ? (
          <div className="text-center py-12 bg-islamic-card border border-islamic-border rounded-2xl space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-islamic-muted stroke-1" />
            <p className="text-xs text-islamic-muted">You are not enrolled in any course yet.</p>
            <Link
              to="/courses"
              className="inline-block px-4 py-2 bg-islamic-primary text-white text-xs font-bold rounded-xl"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressList.map((course) => {
              const totalLessons = course.modules
                ? course.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)
                : 0;

              return (
                <div
                  key={course._id}
                  className="bg-islamic-card border border-islamic-border rounded-2xl overflow-hidden hover:border-islamic-primary/40 transition flex flex-col justify-between"
                >
                  <div className="p-5 space-y-4">
                    <div className="flex gap-4">
                      <img
                        src={
                          course.image ||
                          "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&q=80&w=600"
                        }
                        alt={course.title}
                        className="w-24 h-20 rounded-xl object-cover border border-islamic-border"
                      />
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-islamic-text line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-islamic-muted">By {course.instructor || "Instructor"}</p>
                        <span className="inline-block text-[11px] text-islamic-primary bg-islamic-primary/10 px-2 py-0.5 rounded border border-islamic-primary/20 mt-1">
                          0/{totalLessons} Lessons Done
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-islamic-muted font-medium">
                        <span>Progress</span>
                        <span className="text-islamic-gold">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-islamic-bg rounded-full h-2 overflow-hidden border border-islamic-border">
                        <div
                          className="bg-gradient-to-r from-islamic-primary to-islamic-gold h-full rounded-full transition-all duration-500"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-islamic-bg/50 rounded-xl border border-islamic-border/60 text-xs">
                      <span className="text-islamic-muted block text-[10px] uppercase tracking-wider">Up Next</span>
                      <span className="text-islamic-text font-medium line-clamp-1">
                        {course.modules?.[0]?.lessons?.[0]?.title || "Module 1: Introduction"}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link
                      to={`/course/${course._id}/player`}
                      className="w-full py-2.5 rounded-xl bg-islamic-primary hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2"
                    >
                      <PlayCircle className="w-4 h-4" /> Continue Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;