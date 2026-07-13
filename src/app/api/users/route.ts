import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function hashPassword(plain: string): string {
  return createHash("sha256").update(plain).digest("hex");
}

// ── GET /api/users ── list all users (password excluded) ─────────────────────
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json(users);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── POST /api/users ── create a user ─────────────────────────────────────────
// Required body: { name, email, password }
// Optional:      { role: "super_admin" | "admin" }
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: `A user with email "${email}" already exists.` },
        { status: 409 },
      );
    }

    const user = await User.create({
      name,
      email,
      password: hashPassword(password),
      role: role ?? "admin",
    });

    const { password: _, ...safe } = user.toObject();
    void _;
    return NextResponse.json(
      { message: "User created successfully.", user: safe },
      { status: 201 },
    );
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
