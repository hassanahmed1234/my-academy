import Enrollment from "../models/Enrollment.js";

// GET /api/my-courses
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const { search = "", category = "All" } = req.query;

    const enrollments = await Enrollment.find({
      student: studentId,
    })
      .populate({
        path: "course",
        select: "title arabicTitle image category instructor modules",
      })
      .lean();

    console.log("Student ID:", studentId);
    console.log("Enrollments:", enrollments.length);

    let filteredEnrollments = enrollments.filter(
      (enrollment) => enrollment.course
    );

    // Search
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();

      filteredEnrollments = filteredEnrollments.filter(
        ({ course }) => {
          const title = course.title?.toLowerCase() || "";
          const arabicTitle = course.arabicTitle || "";

          return (
            title.includes(searchTerm) ||
            arabicTitle.includes(search.trim())
          );
        }
      );
    }

    // Category
    if (category !== "All") {
      filteredEnrollments = filteredEnrollments.filter(
        ({ course }) => course.category === category
      );
    }

    // Format courses
    const courses = filteredEnrollments.map((enrollment) => ({
      ...enrollment.course,

      courseId: enrollment.course._id,
      enrollmentId: enrollment._id,

      progressPercentage:
        enrollment.status === "completed"
          ? 100
          : enrollment.progressPercentage || 0,

      status: enrollment.status,

      totalLessons: enrollment.totalLessons,
      completedLessons: enrollment.completedLessons,

      certificateUrl: enrollment.certificateUrl,
    }));

    const inProgress = courses.filter(
      (course) => course.status === "in-progress"
    );

    const completed = courses.filter(
      (course) => course.status === "completed"
    );

    return res.status(200).json({
      success: true,
      data: {
        inProgress,
        completed,
        total: courses.length,
      },
    });
  } catch (error) {
    console.error("Get My Courses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your courses.",
    });
  }
};