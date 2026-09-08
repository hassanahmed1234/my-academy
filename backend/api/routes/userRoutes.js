import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  updatePassword,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Profile Routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Password Change Route
router.put("/change-password", protect, updatePassword);

export default router;