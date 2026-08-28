import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { createSession, type Role } from "@/lib/session";
import { verifyPassword, hashPassword } from "@/lib/password";
import { checkRateLimit, rateLimitResponse, getClientIp } from "@/lib/rateLimit";

const delay = () => new Promise((r) => setTimeout(r, 400));

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    // 8 attempts per 10 minutes, keyed by IP + email so one bad login on a
    // shared office connection doesn't lock out other accounts on it.
    const ip = getClientIp(request);
    const rateLimit = await checkRateLimit(
      `login:${ip}:${email.toLowerCase()}`,
      8,
      10 * 60 * 1000,
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds);
    }

    // ── 1. Check env-based super admin ────────────────────────────────────────
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (envEmail && envPassword) {
      if (email === envEmail && password === envPassword) {
        await createSession(email, "super_admin");
        return NextResponse.json({ success: true });
      }
    }

    // ── 2. Check MongoDB users ─────────────────────────────────────────────────
    await connectDB();
    const dbUser = await User.findOne({
      email: email.toLowerCase(),
      active: true,
    });

    const { valid, needsRehash } = dbUser
      ? verifyPassword(password, dbUser.password)
      : { valid: false, needsRehash: false };

    if (!dbUser || !valid) {
      await delay();
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    if (needsRehash) {
      dbUser.password = hashPassword(password);
      await dbUser.save();
    }

    await createSession(dbUser.email, dbUser.role as Role);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Login error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
