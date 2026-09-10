import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAnnouncements)
  .post(protect, adminOnly, createAnnouncement);

router
  .route("/:id")
  .delete(protect, adminOnly, deleteAnnouncement);

export default router;