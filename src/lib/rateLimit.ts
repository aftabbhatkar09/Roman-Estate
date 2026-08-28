import { NextResponse } from "next/server";
import connectDB from "./mongodb";
import RateLimit from "@/models/RateLimit";

export function getClientIp(request: Request): string {
  // Vercel (and most proxies) set x-forwarded-for as "client, proxy1, proxy2".
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Fixed-window rate limiter backed by MongoDB, so limits hold up across
 * serverless cold starts (an in-memory counter would silently reset on
 * every new instance and give false protection).
 *
 * @param key    Identifies what's being limited, e.g. `login:1.2.3.4:a@b.com`.
 * @param limit  Max requests allowed per window.
 * @param windowMs  Window size in milliseconds.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  await connectDB();

  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const windowKey = `${key}:${windowStart}`;
  const expiresAt = new Date(windowStart + windowMs + 5000); // small buffer

  const doc = await RateLimit.findOneAndUpdate(
    { key: windowKey },
    { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
    { upsert: true, new: true },
  );

  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((windowStart + windowMs - now) / 1000),
  );

  return {
    allowed: doc.count <= limit,
    remaining: Math.max(0, limit - doc.count),
    retryAfterSeconds,
  };
}

/** Shared 429 response for routes that reject over the limit. */
export function rateLimitResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
