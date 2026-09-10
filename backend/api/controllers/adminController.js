// controllers/adminController.js
import User from "../models/User.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import LiveSession from "../models/LiveSession.js";
// import Message from "../models/Message.js";

// ==========================================
// 1. DASHBOARD OVERVIEW & STATS
// ==========================================
export const getDashboardOverview = async (req, res) => {
  try {
    // 1. Parallel counts and total revenue aggregate
    const [studentsCount, coursesCount, enrollmentsCount, revenueAgg] = await Promise.all([
      User.countDocuments({ role: "student" }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Enrollment.aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    // 2. Course Performance (Active Enrollments per Course)
    const coursePerformance = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments"
        }
      },
      {
        $project: {
          title: 1,
          studentsCount: { $size: "$enrollments" },
          completionRate: { $literal: 85 }
        }
      },
      { $limit: 5 }
    ]);

    // 3. Recent Enrollments
 

    // 4. Recent Messages
    // const recentMessages = await Message.find()
    //   .populate("senderId", "name")
    //   .sort({ createdAt: -1 })
    //   .limit(5);

    res.status(200).json({
      stats: {
        students: studentsCount,
        coursesCount,
        revenue: `Rs. ${totalRevenue.toLocaleString()}`
      },
      coursePerformance,
      
      // recentMessages
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching stats", error: error.message });
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