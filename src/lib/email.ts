import nodemailer from "nodemailer";

export type SendEmailOptions = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
};

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !user || !password) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? parseInt(port, 10) : 587,
    secure,
    auth: {
      user,
      pass: password,
    },
  });
}

/**
 * Check if email is configured (SMTP env vars set).
 */
export function isEmailConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}

/**
 * Send an email using Gmail SMTP (or configured SMTP).
 * Use this from server-side only (API routes, server actions).
 * Returns { success: true } or { success: false, error: string }.
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<{ success: true } | { success: false; error: string }> {
  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      error: "Email is not configured (missing SMTP env vars)",
    };
  }

  const to = Array.isArray(options.to) ? options.to : [options.to];
  const from =
    process.env.MAIL_FROM || process.env.SMTP_USER || "noreply@mfqod.com";

  try {
    await transporter.sendMail({
      from,
      to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    });
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
