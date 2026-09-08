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
import myProgressRoutes from "./routes/myProgressRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

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


// 5. CORS Configuration (Specific origins in production)
app.use(cors());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/live-sessions", liveSessionRoutes);
app.use("/api/my-courses", myCoursesRoutes);
app.use("/api/my-progress", myProgressRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin",adminRoutes );
app.use("/api/contact", contactRoutes);

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