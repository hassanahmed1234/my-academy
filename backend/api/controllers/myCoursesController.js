import Course from "../models/Course.js";

// GET /api/my-courses (Fetch student's enrolled courses with search & filter)
export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { search, category } = req.query;

    const courses = await Course.find({ student: studentId }).populate({
      path: "course",
      select: "title arabicTitle image category instructor modules",
    });

    // Valid populated courses filter out karein
    let filtered = courses.filter((e) => e.course !== null);

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.course.title?.toLowerCase().includes(term) ||
          (e.course.arabicTitle && e.course.arabicTitle.includes(term))
      );
    }

    if (category && category !== "All") {
      filtered = filtered.filter((e) => e.course.category === category);
    }

    // Status mapping aur safe object extraction
    const inProgress = filtered
      .filter((e) => e.status !== "completed")
      .map((e) => ({
        ...e.course._doc,
        courseId: e._id,
        progress: e.progress || 0,
        status: e.status,
      }));

    const completed = filtered
      .filter((e) => e.status === "completed")
      .map((e) => ({
        ...e.course._doc,
        courseId: e._id,
        progress: 100,
        status: e.status,
      }));

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