import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { createSession, type Role } from "@/lib/session";

function hashPassword(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

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

    if (!dbUser || dbUser.password !== hashPassword(password)) {
      await delay();
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    await createSession(dbUser.email, dbUser.role as Role);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    console.error("Login error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
