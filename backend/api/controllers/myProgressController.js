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

// 2. Toggle Lesson Complete / Incomplete
export const toggleLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.body;

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
    res.json({ completedLessons: progress.completedLessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};