// controllers/adminController.js
// ==========================================
// 1. DASHBOARD OVERVIEW & STATS
// ==========================================
import User from "../models/User.js";
import Course from "../models/Course.js";
import Task from "../models/Task.js";
import LiveSession from "../models/LiveSession.js";
import Enrollment from "../models/Enrollment.js";

export const getDashboardOverview = async (req, res) => {
  try {
    // Parallel counts for Students, Courses, Active Tasks, and Live Sessions
    const [studentsCount, coursesCount, tasksCount, liveSessionsCount] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments(),
      Task.countDocuments({ status: { $ne: "completed" } }), // Pending / Active Tasks
      LiveSession.countDocuments(),
    ]);

    res.status(200).json({
      stats: {
        students: studentsCount,
        coursesCount: coursesCount,
        tasks: tasksCount,
        liveSessions: liveSessionsCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error fetching stats",
      error: error.message
    });
  }
};

// ==========================================
// 2. COURSES MANAGEMENT
// ==========================================
export const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: "Failed to create course", error: error.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: "Failed to update course", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete course", error: error.message });
  }
};

// ==========================================
// 3. LIVE SESSIONS
// ==========================================
export const getAllLiveSessionsAdmin = async (req, res) => {
  try {
    const sessions = await LiveSession.find().populate("course", "title").sort({ scheduledAt: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching live sessions", error: error.message });
  }
};

export const createLiveSession = async (req, res) => {
  try {
    const newSession = await LiveSession.create(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    res.status(400).json({ message: "Failed to schedule live session", error: error.message });
  }
};

export const deleteLiveSession = async (req, res) => {
  try {
    const deletedSession = await LiveSession.findByIdAndDelete(req.params.id);
    if (!deletedSession) return res.status(404).json({ message: "Live session not found" });
    res.status(200).json({ message: "Live session deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete live session", error: error.message });
  }
};

// ==========================================
// 4. STUDENTS & ENROLLMENTS
// ==========================================
export const getRegisteredStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error: error.message });
  }
};

export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("userId", "name email")
      .populate("courseId", "title price")
      .sort({ createdAt: -1 });
    res.status(200).json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollments", error: error.message });
  }
};