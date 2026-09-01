import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/password";
import { parsePagination, paginationHeaders } from "@/lib/pagination";

export const dynamic = "force-dynamic";

// ── GET /api/users ── list all users (password excluded) ─────────────────────
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { page, limit, skip } = parsePagination(request);
    const [users, total] = await Promise.all([
      User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({}),
    ]);
    return NextResponse.json(users, {
      headers: paginationHeaders({ page, limit, total }),
    });
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
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json(
        { error: "Only super admins can create users." },
        { status: 403 },
      );
    }

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
