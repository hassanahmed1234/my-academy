import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axiosInstance';
import XpRewardModal from '../components/XpRewardModal';

const AuthContext = createContext(null);

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

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Central Dashboard State
  const [dashboardData, setDashboardData] = useState({
    inProgressCourses: [],
    completedCourses: [],
    upcomingLiveClass: null,
    announcements: [],
    tasks: [],
    isLoaded: false,
    loading: false,
    error: "",
  });

  // Central My Courses State
  const [myCoursesData, setMyCoursesData] = useState({
    inProgress: [],
    completed: [],
    progressMap: {},
    isLoaded: false,
    loading: false,
    error: "",
  });

  // Central Quizzes State
  const [quizData, setQuizData] = useState({
    quizzes: [],
    isLoaded: false,
    loading: false,
    error: "",
  });

  // Global XP Reward Modal State
  const [rewardModal, setRewardModal] = useState({
    isOpen: false,
    xpAmount: 50,
    reason: "quiz_completed",
    heading: "MashaAllah! 🎉",
  });

  // Central Assignments State
  const [assignmentData, setAssignmentData] = useState({
    assignments: [],
    isLoaded: false,
    loading: false,
    error: "",
  });

  // Central Profile State
  const [profileData, setProfileData] = useState({
    data: {
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      website: "",
      avatar: "",
      role: "student",
    },
    isLoaded: false,
    loading: false,
    error: "",
  });

 // Updated fetchProfile in AuthContext
const fetchProfile = useCallback(async (forceRefresh = false) => {
  if (profileData.isLoaded && !forceRefresh) return profileData.data;

  setProfileData((prev) => ({ ...prev, loading: true, error: "" }));

  try {
    const { data } = await API.get("/auth/me");
    const userData = data.user || data;

    setUser(userData);
    setProfileData({
      data: userData,
      isLoaded: true,
      loading: false,
      error: "",
    });

    return userData;
  } catch (error) {
    console.error("Failed to fetch fresh user profile:", error);
    setProfileData((prev) => ({
      ...prev,
      loading: false,
      error: error.response?.data?.message || "Failed to load profile",
    }));
  }
}, [profileData.isLoaded, profileData.data]);

  // Dynamic XP Reward Modal Trigger
  const triggerXpReward = async ({ xpAmount = 50, reason = "quiz_completed", heading }) => {
    setRewardModal({
      isOpen: true,
      xpAmount,
      reason,
      heading: heading || "MashaAllah! 🎉",
    });
    await fetchProfile();
  };

  const closeXpReward = () => {
    setRewardModal((prev) => ({ ...prev, isOpen: false }));
  };

  // Check Auth Status on Mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedToken = localStorage.getItem('token');

      if (!storedToken) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await API.get('/auth/me');
        const userData = data.user || data;
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Fetch Dashboard Data (Cached)
  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    if (dashboardData.isLoaded && !forceRefresh) return;

    setDashboardData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const [coursesRes, progressRes, annRes, tasksRes] = await Promise.allSettled([
        API.get("/my-courses"),
        API.get("/my-progress/all"),
        API.get("/announcements"),
        API.get("/tasks"),
      ]);

      let rawCourses = [];
      if (coursesRes.status === "fulfilled") {
        const cData = coursesRes.value.data?.data || coursesRes.value.data || [];
        rawCourses = Array.isArray(cData) ? cData : [...(cData.inProgress || []), ...(cData.completed || [])];
      }

      let progressData = [];
      if (progressRes.status === "fulfilled") {
        progressData = progressRes.value.data?.data || progressRes.value.data || [];
      }

      const progressMap = {};
      if (Array.isArray(progressData)) {
        progressData.forEach((p) => {
          const cId = p.courseId?._id || p.courseId || p.course;
          if (cId) progressMap[String(cId)] = p;
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

      let announcementsList = DUMMY_ANNOUNCEMENTS;
      if (annRes.status === "fulfilled") {
        const annData = annRes.value.data?.data || annRes.value.data || [];
        if (Array.isArray(annData) && annData.length > 0) announcementsList = annData;
      }

      let tasksList = DUMMY_TASKS;
      if (tasksRes.status === "fulfilled") {
        const taskData = tasksRes.value.data?.data || tasksRes.value.data || [];
        if (Array.isArray(taskData) && taskData.length > 0) tasksList = taskData;
      }

      let liveClassObj = null;
      try {
        const liveRes = await API.get("/live-sessions");
        const sessions = Array.isArray(liveRes.data) ? liveRes.data : liveRes.data?.sessions || [];

        if (sessions.length > 0) {
          const activeSession = sessions[0];
          liveClassObj = {
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
          };
        }
      } catch {
        liveClassObj = {
          id: "lc101",
          title: "Seerah Q&A & Open Discussion",
          courseName: "Seerah of Prophet Muhammad ﷺ",
          instructor: "Sheikh Abdul Rahman",
          date: "2026-09-15",
          time: "8:00 PM PKT",
          meetingLink: "https://zoom.us/j/example123456",
        };
      }

      setDashboardData({
        inProgressCourses: inProgress,
        completedCourses: completed.length > 0 ? completed : progressData,
        upcomingLiveClass: liveClassObj,
        announcements: announcementsList,
        tasks: tasksList,
        isLoaded: true,
        loading: false,
        error: "",
      });
    } catch (err) {
      setDashboardData((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load dashboard data.",
      }));
    }
  }, [dashboardData.isLoaded]);

  // Fetch My Courses & Progress (Cached)
  const fetchMyCourses = useCallback(async (forceRefresh = false) => {
    if (myCoursesData.isLoaded && !forceRefresh) return;

    setMyCoursesData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const [coursesRes, progressRes] = await Promise.allSettled([
        API.get("/my-courses"),
        API.get("/my-progress/all"),
      ]);

      let inProgressList = [];
      if (coursesRes.status === "fulfilled") {
        const courseData = coursesRes.value.data?.data || coursesRes.value.data || {};
        inProgressList = Array.isArray(courseData.inProgress)
          ? courseData.inProgress
          : Array.isArray(courseData)
            ? courseData
            : [];
      }

      let completedList = [];
      let pMap = {};

      if (progressRes.status === "fulfilled") {
        const progressList =
          progressRes.value.data?.data?.data ||
          progressRes.value.data?.data ||
          (Array.isArray(progressRes.value.data) ? progressRes.value.data : []);

        completedList = Array.isArray(progressList) ? progressList : [];

        if (Array.isArray(progressList)) {
          progressList.forEach((item) => {
            const cId = item.courseId || item._id;
            if (cId) {
              pMap[String(cId)] = Array.isArray(item.completedLessons)
                ? item.completedLessons
                : [];
            }
          });
        }
      }

      setMyCoursesData({
        inProgress: inProgressList,
        completed: completedList,
        progressMap: pMap,
        isLoaded: true,
        loading: false,
        error: "",
      });
    } catch (err) {
      setMyCoursesData((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load your courses.",
      }));
    }
  }, [myCoursesData.isLoaded]);

  // Fetch Quizzes List (Cached)
  const fetchQuizzes = useCallback(async (forceRefresh = false) => {
    if (quizData.isLoaded && !forceRefresh) return;

    setQuizData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const res = await API.get("/quizzes");
      const list = Array.isArray(res.data) ? res.data : res.data.quizzes || [];
      setQuizData({
        quizzes: list,
        isLoaded: true,
        loading: false,
        error: "",
      });
    } catch (err) {
      setQuizData((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load quizzes.",
      }));
    }
  }, [quizData.isLoaded]);

  // Fetch Assignments List (Cached)
  const fetchAssignments = useCallback(async (forceRefresh = false) => {
    if (assignmentData.isLoaded && !forceRefresh) return;

    setAssignmentData((prev) => ({ ...prev, loading: true, error: "" }));

    try {
      const res = await API.get("/assignment/student/list");
      const list = Array.isArray(res.data) ? res.data : res.data.assignments || [];
      setAssignmentData({
        assignments: list,
        isLoaded: true,
        loading: false,
        error: "",
      });
    } catch (err) {
      setAssignmentData((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.message || "Failed to load assignments.",
      }));
    }
  }, [assignmentData.isLoaded]);

  // Fetch Single Assignment Detail
  const fetchAssignmentDetail = async (id) => {
    try {
      const res = await API.get(`/assignment/student/detail/${id}`);
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || "Failed to fetch assignment details.";
    }
  };

  // Submit Assignment with Award XP Integration
  const submitAssignment = async (assignmentId, payload) => {
    try {
      const res = await API.post(`/assignment/student/submit/${assignmentId}`, payload);
      
      if (fetchAssignments) {
        await fetchAssignments(true);
      }

      if (payload.isFinalSubmit) {
        try {
          await API.post('/xp/award', {
            xpAmount: 15,
            reason: 'assignment_submitted',
            referenceId: assignmentId,
          });
          await fetchProfile();
        } catch (xpErr) {
          console.error("Failed to award XP:", xpErr);
        }
      }

      return res.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to submit assignment";
      throw errorMessage;
    }
  };

  // Update Profile Details
  const updateProfile = async (updatedFields) => {
    try {
      const { data } = await API.put("/users/profile", updatedFields);
      const updatedName = data.user?.name || data.name || updatedFields.name;

      if (updatedName) {
        localStorage.setItem("userName", updatedName);
      }

      setProfileData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          ...updatedFields,
          name: updatedName || prev.data.name,
        },
      }));

      setUser((prev) => (prev ? { ...prev, name: updatedName || prev.name } : prev));
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Failed to update profile.";
    }
  };

  // Upload Avatar
  const uploadAvatar = async (file) => {
    const imageFormData = new FormData();
    imageFormData.append("avatar", file);

    try {
      const { data } = await API.put("/users/profile", imageFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newAvatarUrl = data.user?.avatar || data.avatar;

      if (newAvatarUrl) {
        setProfileData((prev) => ({
          ...prev,
          data: { ...prev.data, avatar: newAvatarUrl },
        }));
        setUser((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : prev));
      }

      return newAvatarUrl;
    } catch (err) {
      throw err.response?.data?.message || "Image upload failed. Please try again.";
    }
  };

  // Change Password
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      const { data } = await API.put("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return data;
    } catch (err) {
      throw err.response?.data?.message || "Failed to update password.";
    }
  };

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setDashboardData({
      inProgressCourses: [],
      completedCourses: [],
      upcomingLiveClass: null,
      announcements: [],
      tasks: [],
      isLoaded: false,
      loading: false,
      error: "",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        submitAssignment,
        loading,
        setUser,
        setIsAuthenticated,
        dashboardData,
        fetchDashboardData,
        myCoursesData,
        fetchMyCourses,
        quizData,
        fetchQuizzes,
        assignmentData,
        fetchAssignments,
        fetchAssignmentDetail,
        profileData,
        fetchProfile,
        updateProfile,
        uploadAvatar,
        changePassword,
        triggerXpReward,
      }}
    >
      {children}
      <XpRewardModal
        isOpen={rewardModal.isOpen}
        onClose={closeXpReward}
        xpAmount={rewardModal.xpAmount}
        reason={rewardModal.reason}
        heading={rewardModal.heading}
        totalXp={user?.xp}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};