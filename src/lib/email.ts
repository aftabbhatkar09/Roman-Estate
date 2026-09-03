import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress() {
  return process.env.EMAIL_FROM || "Roman Estate <onboarding@resend.dev>";
}

/**
 * Emails a password reset link to an admin user. Best-effort, same as
 * inquiry notifications — logs and returns quietly if email isn't configured
 * or sending fails, since the caller must not reveal whether it worked (that
 * would leak whether the email address has an account).
 */
export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const resend = getResend();
  if (!resend) {
    console.warn(
      "Skipping password reset email: RESEND_API_KEY not set. Reset URL:",
      resetUrl,
    );
    return;
  }

  try {
    await resend.emails.send({
      from: getFromAddress(),
      to,
      subject: "Reset your Roman Estate admin password",
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2>Reset Your Password</h2>
          <p>We received a request to reset the password for this admin account. This link expires in 15 minutes.</p>
          <p><a href="${resetUrl}" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none;">Reset Password</a></p>
          <p style="color: #999; font-size: 12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}

interface InquiryNotificationInput {
  name: string;
  email: string;
  phone: string;
  requirementType: string;
  bhk?: string;
  message: string;
}

/**
 * Emails the team when a new inquiry comes in. Best-effort: if RESEND_API_KEY
 * isn't configured (or sending fails for any reason), this logs and returns
 * quietly rather than breaking the contact form for the visitor.
 */
export async function sendInquiryNotification(inquiry: InquiryNotificationInput) {
  const resend = getResend();
  const to = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (!resend || !to) {
    console.warn(
      "Skipping inquiry email notification: RESEND_API_KEY or NOTIFICATION_EMAIL/ADMIN_EMAIL not set.",
    );
    return;
  }

  try {
    await resend.emails.send({
      from: getFromAddress(),
      to,
      replyTo: inquiry.email,
      subject: `New Inquiry: ${inquiry.name} (${inquiry.requirementType})`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="margin-bottom: 4px;">New Website Inquiry</h2>
          <p style="color: #666; margin-top: 0;">${inquiry.requirementType}</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 6px 0; color: #666;">Name</td><td style="padding: 6px 0;">${inquiry.name}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Email</td><td style="padding: 6px 0;">${inquiry.email}</td></tr>
            <tr><td style="padding: 6px 0; color: #666;">Phone</td><td style="padding: 6px 0;">${inquiry.phone}</td></tr>
            ${inquiry.bhk ? `<tr><td style="padding: 6px 0; color: #666;">Property Size</td><td style="padding: 6px 0;">${inquiry.bhk}</td></tr>` : ""}
          </table>
          <p style="margin-top: 16px; white-space: pre-wrap;">${inquiry.message}</p>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">
            Reply directly to this email to respond to ${inquiry.name}, or manage it from the admin panel.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send inquiry notification email:", error);
  }
}
