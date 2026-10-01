
import { Redis } from "@upstash/redis";

const redisEnabled = process.env.REDIS_ENABLED !== "false";

let redis = null;

if (
  redisEnabled &&
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export const isRedisConfigured = Boolean(redis);

export default redis;