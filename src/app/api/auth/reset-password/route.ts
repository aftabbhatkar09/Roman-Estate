import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { verifyResetToken } from "@/lib/session";
import { hashPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and new password are required." },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 },
      );
    }

    const decoded = await verifyResetToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: "This reset link is invalid or has expired." },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email: decoded.email, active: true });

    // The embedded password hash must still match the user's current
    // password — if it doesn't, this link was already used (or the password
    // changed some other way since), so it's stale.
    if (!user || user.password !== decoded.pwHash) {
      return NextResponse.json(
        { error: "This reset link is invalid or has already been used." },
        { status: 400 },
      );
    }

    user.password = hashPassword(password);
    await user.save();

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
