
import express from "express";
import redis, { isRedisConfigured } from "../config/redis.js";

const router = express.Router();

router.get("/health", async (req, res) => {
  if (!isRedisConfigured) {
    return res.status(503).json({
      success: false,
      message: "Redis is not configured",
    });
  }

  try {
    const start = Date.now();

    await redis.set("academy:health", "connected", {
      ex: 60,
    });

    const result = await redis.get("academy:health");

    return res.status(200).json({
      success: true,
      message: "Redis connected successfully",
      data: {
        status: result === "connected" ? "UP" : "ERROR",
        latency: `${Date.now() - start}ms`,
      },
    });
  } catch (error) {
    console.error("Redis Health Error:", error);

    return res.status(503).json({
      success: false,
      message: "Redis connection failed",
    });
  }
});

export default router;