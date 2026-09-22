import LiveSession from "../models/LiveSession.js";

// @desc    Schedule a new live session (Admin only)
// @route   POST /api/live-sessions
// @access  Private/Admin
export const createLiveSession = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      thumbnail,
      bannerImage,
      course,
      scholarName,
      meetingUrl,
      scheduledAt,
    } = req.body;

    if (!title || !course || !scholarName || !meetingUrl || !scheduledAt) {
      return res.status(400).json({
        message: "Please fill all required fields, including course selection.",
      });
    }

    const newSession = await LiveSession.create({
      title,
      description: description || "",
      category: category || "General Talk",
      thumbnail: thumbnail || "",
      bannerImage: bannerImage || "",
      course,
      scholarName,
      meetingUrl,
      scheduledAt,
      createdBy: req.user?._id,
    });

    const populatedSession = await newSession.populate(
      "course",
      "title arabicTitle image"
    );

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

// @desc    Get all live sessions with auto status refresh
// @route   GET /api/live-sessions
// @access  Public / Authenticated
export const getLiveSessions = async (req, res) => {
  try {
    // Dynamic status auto-updater logic (Scheduled sessions whose time has passed)
    const now = new Date();
    await LiveSession.updateMany(
      { scheduledAt: { $lte: now }, status: "Scheduled" },
      { $set: { status: "Live" } }
    );

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

// @desc    Update live session details / status
// @route   PATCH /api/live-sessions/:id/status
// @access  Private/Admin
export const updateSessionStatus = async (req, res) => {
  try {
    const { status, title, description, category, thumbnail, bannerImage, meetingUrl, scholarName, scheduledAt } = req.body;

    const updateFields = {};
    if (status) {
      if (!["Scheduled", "Live", "Completed", "Cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value provided." });
      }
      updateFields.status = status;
    }

    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (category) updateFields.category = category;
    if (thumbnail !== undefined) updateFields.thumbnail = thumbnail;
    if (bannerImage !== undefined) updateFields.bannerImage = bannerImage;
    if (meetingUrl) updateFields.meetingUrl = meetingUrl;
    if (scholarName) updateFields.scholarName = scholarName;
    if (scheduledAt) updateFields.scheduledAt = scheduledAt;

    const updatedSession = await LiveSession.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("course", "title arabicTitle image");

    if (!updatedSession) {
      return res.status(404).json({ message: "Live session not found." });
    }

    res.status(200).json({
      message: "Live session updated successfully.",
      session: updatedSession,
    });
  } catch (error) {
    console.error("Error updating session:", error);
    res.status(500).json({ message: "Failed to update session." });
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