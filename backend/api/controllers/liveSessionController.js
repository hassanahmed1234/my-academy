import LiveSession from "../models/LiveSession.js";

// @desc    Schedule a new live session (Admin only)
// @route   POST /api/live-sessions
// @access  Private/Admin
export const createLiveSession = async (req, res) => {
  try {
    const { title, course, scholarName, meetingUrl, scheduledAt } = req.body;

    if (!title || !course || !scholarName || !meetingUrl || !scheduledAt) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const newSession = await LiveSession.create({
      title,
      course,
      scholarName,
      meetingUrl,
      scheduledAt,
      createdBy: req.user?._id,
    });

    const populatedSession = await newSession.populate("course", "title arabicTitle");

    res.status(201).json({
      message: "Live session scheduled successfully",
      session: populatedSession,
    });
  } catch (error) {
    console.error("Error creating live session:", error);
    res.status(500).json({
      message: error.message || "Internal server error while scheduling session.",
    });
  }
};

// @desc    Get all upcoming/active live sessions
// @route   GET /api/live-sessions
// @access  Public / Authenticated
export const getLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find()
      .populate("course", "title arabicTitle image")
      .sort({ scheduledAt: 1 });

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching live sessions:", error);
    res.status(500).json({
      message: "Failed to retrieve live sessions.",
    });
  }
};

// @desc    Delete a live session
// @route   DELETE /api/live-sessions/:id
// @access  Private/Admin
export const deleteLiveSession = async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndDelete(req.params.id);

    if (!session) {
      return res.status(404).json({ message: "Live session not found." });
    }

    res.status(200).json({ message: "Live session deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete live session." });
  }
};