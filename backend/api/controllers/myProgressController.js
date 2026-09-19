import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";

// 1. Get Completed Lessons Count & IDs
export const getCourseProgress = async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId,
    });

    res.json({
      completedLessons: progress ? progress.completedLessons : [],
      count: progress ? progress.completedLessons.length : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark Lesson Complete (One-time only)
export const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user._id;

  if (!courseId || !lessonId) {
    return res.status(400).json({ message: "Course ID and Lesson ID are required." });
  }

  try {
    let progress = await UserProgress.findOne({
      userId,
      courseId,
    });

    let isNewCompletion = false;

    if (!progress) {
      // First time completion for this course
      progress = new UserProgress({
        userId,
        courseId,
        completedLessons: [lessonId],
      });
      await progress.save();
      isNewCompletion = true;
    } else {
      // Check if lesson is already marked complete
      const isAlreadyCompleted = progress.completedLessons.includes(lessonId);

      if (!isAlreadyCompleted) {
        progress.completedLessons.push(lessonId);
        await progress.save();
        isNewCompletion = true;
      }
    }

    // Naye lesson completion par User Model me count +1 increment hoga
    if (isNewCompletion) {
      await User.findByIdAndUpdate(userId, {
        $inc: { lessonsCompleted: 1 },
      });
    }

    res.json({
      completedLessons: progress.completedLessons,
      message: "Lesson completed successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUserProgress = async (req, res) => {
  try {
    // 1. .populate("courseId") use karke Course model ka saara data fetch kiya
    const progressList = await UserProgress.find({ userId: req.user._id })
      .populate("courseId")
      .lean();

    // 2. Streamlined format mapping with full course details
    const completedData = progressList.map((item) => {
      // courseId object context populated model representation rakhta hai
      const courseObj = item || {};

      return {
        _id: item._id,
        courseId: courseObj._id || item.courseId, // String / ObjectId
        course: courseObj,                        // Complete populated Course object
        completedLessons: item.completedLessons || [],
        count: item.completedLessons ? item.completedLessons.length : 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    res.json({
      success: true,
      data: completedData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

