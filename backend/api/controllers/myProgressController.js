import UserProgress from "../models/UserProgress.js";
import { awardXP } from "./leaderboardController.js";

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

// 2. Toggle Lesson Complete / Incomplete
export const toggleLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;

  let userId = req.user._id

  if (!courseId || !lessonId) {
    return res.status(400).json({ message: "Course ID and Lesson ID are required." });
  }

  try {
    let progress = await UserProgress.findOne({
      userId: req.user._id,
      courseId,
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user._id,
        courseId,
        completedLessons: [lessonId],
      });
    } else {
      const lessonIndex = progress.completedLessons.indexOf(lessonId);
      if (lessonIndex > -1) {
        // Remove lesson if already marked complete
        progress.completedLessons.splice(lessonIndex, 1);
      } else {
        // Add lesson if not complete
        progress.completedLessons.push(lessonId);
      }
    }

    await progress.save();

    await awardXP(userId,"COURSE_COMPLETE", courseId);
    res.json({ completedLessons: progress.completedLessons });
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