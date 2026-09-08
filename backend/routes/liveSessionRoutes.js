import express from "express";
import {
  createLiveSession,
  getLiveSessions,
  deleteLiveSession,
} from "../controllers/liveSessionController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(getLiveSessions)
  .post(protect, adminOnly, createLiveSession);

router.route("/:id").delete(protect, adminOnly, deleteLiveSession);

export default router;
