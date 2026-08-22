import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

// ── GET /api/users/[id] ───────────────────────────────────────────────────────
export async function GET(_req: NextRequest, context: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    await connectDB();
    const user = await User.findById(id).select("-password").lean();
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── PUT /api/users/[id] ── update user fields ─────────────────────────────────
// role: "super_admin" | "admin"
// Password is re-hashed if included. Omit password to keep existing.
export async function PUT(request: NextRequest, context: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    await connectDB();
    const { name, email, password, role, active } = await request.json();

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (email && email.toLowerCase() !== user.email) {
      const clash = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id },
      });
      if (clash) {
        return NextResponse.json(
          { error: `Email "${email}" is already taken by another user.` },
          { status: 409 },
        );
      }
      user.email = email.toLowerCase();
    }

    if (name !== undefined) user.name = name;
    if (role !== undefined) user.role = role;
    if (active !== undefined) user.active = active;

    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters." },
          { status: 400 },
        );
      }
      user.password = hashPassword(password);
    }

    await user.save();

    const { password: _, ...safe } = user.toObject();
    void _;
    return NextResponse.json({
      message: "User updated successfully.",
      user: safe,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ── DELETE /api/users/[id] ────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, context: Params) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    await connectDB();
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (user.role === "super_admin") {
      return NextResponse.json(
        { error: "Super admin users cannot be deleted." },
        { status: 403 },
      );
    }
    await user.deleteOne();
    return NextResponse.json({ message: "User deleted successfully." });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
