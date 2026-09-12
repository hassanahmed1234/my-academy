import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Routes Imports
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import liveSessionRoutes from "./routes/liveSessionRoutes.js";
import myCoursesRoutes from "./routes/myCoursesRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import myProgressRoutes from "./routes/myProgressRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import adminQuizRoutes from "./routes/adminQuizRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import studentQuizRoutes from "./routes/studentQuizRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";

const app = express();

// 1. Helmet: HTTP Headers Security
app.use(helmet());

connectDB();


// 2. Rate Limiting: Brute Force & DDOS Protection
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Har IP se 15 min mein max 100 requests allow hongi
  message: {
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Puray API par Rate Limiter apply karein
app.use("/api", limiter);

// 3. Body Parser (Limit payload size for security)
app.use(express.json({ limit: "10kb" }));

// Allowed origins list
const allowedOrigins = [
  "http://localhost:5173", // Vite dev server
  "http://localhost:3000", // React standard dev server
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
  'https://my-academy-y59r.vercel.app/',   // Production frontend URL (from .env)
].filter(Boolean); // Filter undefined values if CLIENT_URL is missing

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, cURL, or local apps ke non-browser requests ko allow karne ke liye !origin check
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Access denied"));
      }
    },
    credentials: true, // Cookies / Authorization headers allow karne ke liye
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/live-sessions", liveSessionRoutes);
app.use("/api/my-courses", myCoursesRoutes);
app.use("/api/enroll", enrollmentRoutes);
app.use("/api/my-progress", myProgressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/quizzes", adminQuizRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/student/quizzes", studentQuizRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// Base Health Check Route
app.get("/", (req, res) => {
  res.send("Islamic Academy ES6 API is running...");
});

// Global 404 Handler (Undefined Routes)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

export default app;