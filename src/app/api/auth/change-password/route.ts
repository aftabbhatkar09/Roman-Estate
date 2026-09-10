import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/session";
import { verifyPassword, hashPassword } from "@/lib/password";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

// Lets a signed-in admin change their own password (needs the current one).
// This only touches the database user record. The bootstrap account defined
// by ADMIN_EMAIL / ADMIN_PASSWORD signs in straight from those environment
// variables, so its password can't be changed here — that's called out with
// a clear message rather than a confusing "current password is incorrect".
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const email = session.email.toLowerCase();

    const rateLimit = await checkRateLimit(
      `change-password:${email}`,
      10,
      15 * 60 * 1000,
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds);
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password are both required." },
        { status: 400 },
      );
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 },
      );
    }
    if (newPassword === currentPassword) {
      return NextResponse.json(
        { error: "New password must be different from the current one." },
        { status: 400 },
      );
    }

    if (
      process.env.ADMIN_EMAIL &&
      email === process.env.ADMIN_EMAIL.toLowerCase()
    ) {
      return NextResponse.json(
        {
          error:
            "This account signs in with the ADMIN_PASSWORD environment variable. Change it in your hosting settings (e.g. Vercel → Environment Variables) and redeploy.",
        },
        { status: 400 },
      );
    }

    await connectDB();
    const user = await User.findOne({ email, active: true });
    if (!user) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 },
      );
    }

    const { valid } = verifyPassword(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 },
      );
    }

    user.password = hashPassword(newPassword);
    await user.save();

    return NextResponse.json({ message: "Password changed successfully." });
  } catch (error: unknown) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
