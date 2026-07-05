import nodemailer from 'nodemailer';

/**
 * Public base URL of the app, used in email links and QR codes.
 * On Render this is provided automatically as RENDER_EXTERNAL_URL.
 */
export function appUrl(): string {
  return process.env.APP_URL ?? process.env.RENDER_EXTERNAL_URL ?? 'http://localhost:5173';
}

/** When no SMTP is configured, accounts are auto-verified at registration instead. */
export const isMailerConfigured = Boolean(process.env.SMTP_HOST);

const transport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
    })
  : null;

const FROM = process.env.EMAIL_FROM ?? 'Kodstigen <no-reply@kodstigen.local>';

export async function sendMail(to: string, subject: string, html: string, text: string) {
  if (!transport) {
    // no SMTP configured (local dev), log instead of sending so the flow stays testable
    console.log(`[mailer] SMTP not configured. Would send to ${to}: "${subject}"\n${text}`);
    return;
  }
  await transport.sendMail({ from: FROM, to, subject, html, text });
}

export async function sendVerificationEmail(to: string, username: string, token: string) {
  const link = `${appUrl()}/verify-email?token=${token}`;
  await sendMail(
    to,
    'Verify your Kodstigen email',
    `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
      <h2>Welcome to Kodstigen, ${username}! ⚒️</h2>
      <p>Confirm your email address to finish setting up your account.</p>
      <p style="margin:24px 0">
        <a href="${link}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">
          Verify my email
        </a>
      </p>
      <p style="color:#666;font-size:13px">Or paste this link into your browser:<br>${link}</p>
      <p style="color:#666;font-size:13px">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    </div>`,
    `Welcome to Kodstigen, ${username}!\n\nVerify your email: ${link}\n\nThis link expires in 24 hours.`
  );
}
