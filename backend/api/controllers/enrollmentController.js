import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";

// POST /api/enroll
export const enrollInCourse = async (req, res) => {
  try {
    const studentId = req.user._id; // Auth Middleware se
  const { courseId } = req.params;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    // 1. Check karein course exist karta hai ya nahi
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // 2. Check karein student pehle se enrolled to nahi hai
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course.",
      });
    }

    // 3. Course ke kul (total) lessons count karein
    const totalLessons = course.modules.reduce(
      (acc, mod) => acc + (mod.lessons ? mod.lessons.length : 0),
      0
    );

    // 4. Naya enrollment record create karein
    const newEnrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
      status: "in-progress",
      completedLessons: [],
      totalLessons: totalLessons,
      progressPercentage: 0,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully!",
      data: newEnrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll in course",
    });
  }
};

// PUT /api/enroll/progress (Jab student ek lesson complete kare)
export const updateLessonProgress = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { courseId, lessonId } = req.body;

    const enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: "Enrollment not found" });
    }

    // Sub-lesson add karein agar pehle se nahi hai
    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    // Progress Calculate karein
    if (enrollment.totalLessons > 0) {
      enrollment.progressPercentage = Math.round(
        (enrollment.completedLessons.length / enrollment.totalLessons) * 100
      );
    }

    // Agar saare lessons complete ho gaye hain, to status 'completed' kar do
    if (enrollment.progressPercentage >= 100) {
      enrollment.status = "completed";
      enrollment.progressPercentage = 100;
      // Optional: Yahan Certificate link bhi set kar sakte hain
      enrollment.certificateUrl = `/certificates/${enrollment._id}.pdf`;
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Progress updated successfully",
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update progress",
    });
  }
};