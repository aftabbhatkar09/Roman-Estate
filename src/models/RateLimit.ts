import mongoose, { Schema, Document } from "mongoose";

// One document per (key, time-window) pair. `key` already encodes the
// window boundary, so a fresh window always gets a fresh document — no
// manual reset logic needed. The TTL index cleans up expired windows
// automatically; MongoDB sweeps expired documents roughly every 60s, so a
// handful of stale rows may briefly linger, which is harmless since a new
// request always targets the *current* window's key regardless.
export interface IRateLimit extends Document {
  key: string;
  count: number;
  expiresAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
});

RateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>("RateLimit", RateLimitSchema);
