import User from "../models/User.js";

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
        website: user.website,
        avatar: user.avatar,
        enrolledCourses: user.enrolledCourses,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Name / FullName support
    // if (req.body.fullName || req.body.name) {
    //   user.name = req.body.fullName || req.body.name;
    // }

    // if (req.body.phone !== undefined) user.phone = req.body.phone;
    // if (req.body.location !== undefined) user.location = req.body.location;
    // if (req.body.bio !== undefined) user.bio = req.body.bio;
    // if (req.body.website !== undefined) user.website = req.body.website;

    // File Upload via Multer / Cloudinary
    if (req.file && req.file.path) {
      user.avatar = req.file.path;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        _id: updatedUser._id,
        // name: updatedUser.name,
        // fullName: updatedUser.name,
        // email: updatedUser.email,
        // role: updatedUser.role,
        // phone: updatedUser.phone,
        // location: updatedUser.location,
        // bio: updatedUser.bio,
        // website: updatedUser.website,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update user password
// @route   PUT /api/users/change-password
// @access  Private
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Please provide both current and new passwords" });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: "New password must be at least 6 characters long" });
  }

  try {
    // Password field explicitly retrieve karne ke liye select('+password')
    const user = await User.findById(req.user._id).select("+password");

    if (user && (await user.matchPassword(currentPassword))) {
      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(400).json({ message: "Invalid current password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};