import Enrollment from "../models/Enrollment.js";

// GET /api/my-courses (Fetch student's enrolled courses with search & filter)
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id; // Auth middleware se authenticated user ID
    const { search, category } = req.query;

    let query = { student: studentId };

    const enrollments = await Enrollment.find(query).populate({
      path: "course",
      select: "title arabicTitle thumbnail category instructor",
    });

    // In-memory filter for search term & course category
    let filtered = enrollments.filter((e) => e.course !== null);

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.course.title.toLowerCase().includes(term) ||
          (e.course.arabicTitle && e.course.arabicTitle.includes(term))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter((e) => e.course.category === category);
    }

    // Split into Continue Learning vs Completed
    const inProgress = filtered.filter((e) => e.status === "in-progress");
    const completed = filtered.filter((e) => e.status === "completed");

    res.status(200).json({
      success: true,
      data: {
        inProgress,
        completed,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch enrolled courses",
    });
  }
};