import express from "express";
import {
  getTasks,
  createTask,
  deleteTask,
} from "../controllers/taskController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getTasks)
  .post(protect, adminOnly, createTask);

router
  .route("/:id")
  .delete(protect, adminOnly, deleteTask);

export default router;