import express from "express";
import { getUserProfile, updateUserProfile, updatePassword } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadCloud } from "../config/cloudinary.js";
import { addGlobalXp } from "../controllers/myProgressController.js";

const router = express.Router();

router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, uploadCloud.single("avatar"), updateUserProfile);

  router.post("/add-xp", protect, addGlobalXp);
  

router.put("/change-password", protect, updatePassword);

export default router;