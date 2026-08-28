import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { createResetToken } from "@/lib/session";
import { sendPasswordResetEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/metadata";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

const delay = () => new Promise((r) => setTimeout(r, 400));

// Always responds with a generic success message, whether or not the email
// belongs to an account — so this endpoint can't be used to enumerate which
// addresses have admin access.
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 },
      );
    }

    // 3 requests per hour, keyed by the target email — caps how many reset
    // emails one address can be bombed with, regardless of source IP.
    const rateLimit = await checkRateLimit(
      `forgot-password:${email.toLowerCase()}`,
      3,
      60 * 60 * 1000,
    );
    if (!rateLimit.allowed) {
      return rateLimitResponse(rateLimit.retryAfterSeconds);
    }

    await connectDB();
    const user = await User.findOne({
      email: email.toLowerCase(),
      active: true,
    });

    if (user) {
      const token = await createResetToken(user.email, user.password);
      const resetUrl = `${SITE_URL}/admin/reset-password?token=${encodeURIComponent(token)}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    } else {
      await delay();
    }

    return NextResponse.json({
      message:
        "If that email belongs to an admin account, a reset link has been sent.",
    });
  } catch (error: unknown) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
