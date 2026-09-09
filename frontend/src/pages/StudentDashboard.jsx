import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Video,
  Clock,
  PlayCircle,
  Calendar,
  Loader2,
  CheckCircle,
} from "lucide-react";
import API from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState({
    inProgress: [],
    completed: [],
  });
  const [progressMap, setProgressMap] = useState({}); // Stores { courseId: [lessonIds] }
  const [upcomingLiveClass, setUpcomingLiveClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch user's enrolled courses
        const coursesRes = await API.get("/my-courses");
        const courseData = coursesRes.data?.data || coursesRes.data || {};

        setEnrolledCourses({
          inProgress: Array.isArray(courseData.inProgress) ? courseData.inProgress : [],
          completed: Array.isArray(courseData.completed) ? courseData.completed : [],
        });

        // 2. Fetch all completed lessons progress (Without Params)
        try {
          const progressRes = await API.get("/my-progress/all");
          const progressList = progressRes.data?.data || progressRes.data || [];

          console.log(progressRes)

          // Map courseId -> Array of completed lesson IDs
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
          console.error("Failed to fetch progress map:", pErr);
        }

        // 3. Fetch live sessions
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

  // Calculate total completed lessons count across all enrolled courses
  const totalCompletedLessonsCount = Object.values(progressMap).reduce(
    (acc, lessons) => acc + (lessons?.length || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-islamic-gold">
        <Loader2 className="w-8 h-8 animate-spin text-islamic-primary" />
      </div>
    );
  }

  const inProgressList = enrolledCourses.inProgress || [];

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
            <span className="text-lg font-bold text-islamic-primary">{totalCompletedLessonsCount}</span>
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
              // Extract all lessons from course modules
              const allLessons = course.modules
                ? course.modules.flatMap((m) => m.lessons || [])
                : [];
              const totalLessons = allLessons.length;

              // Extract completed lesson IDs from state for this course
              const completedLessonIds = progressMap[course._id] || [];
              const completedCount = completedLessonIds.length;

              // Calculate percentage progress
              const progressPercentage = totalLessons > 0 
                ? Math.round((completedCount / totalLessons) * 100) 
                : 0;

              // Find next uncompleted lesson
              const nextLesson = allLessons.find(
                (lesson) => !completedLessonIds.includes(lesson._id)
              ) || allLessons[0];

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
                        className="w-24 h-20 rounded-xl object-cover border border-islamic-border shrink-0"
                      />
                      <div className="space-y-1 w-full">
                        <h3 className="text-base font-bold text-islamic-text line-clamp-1">{course.title}</h3>
                        <p className="text-xs text-islamic-muted">By {course.instructor || "Instructor"}</p>
                        
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] text-islamic-primary bg-islamic-primary/10 px-2 py-0.5 rounded border border-islamic-primary/20 font-medium">
                            <CheckCircle className="w-3 h-3" /> {completedCount}/{totalLessons} Lessons Done
                          </span>
                          <span className="text-[11px] font-semibold text-islamic-gold">
                            {progressPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Progress Bar */}
                    <div className="w-full bg-islamic-bg h-1.5 rounded-full overflow-hidden border border-islamic-border/50">
                      <div
                        className="bg-gradient-to-r from-islamic-primary to-islamic-gold h-full transition-all duration-300"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>

                    {/* Up Next Section */}
                    <div className="p-3 bg-islamic-bg/50 rounded-xl border border-islamic-border/60 text-xs">
                      <span className="text-islamic-muted block text-[10px] uppercase tracking-wider">
                        {progressPercentage === 100 ? "Completed" : "Up Next"}
                      </span>
                      <span className="text-islamic-text font-medium line-clamp-1">
                        {nextLesson?.title || "No lessons available"}
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