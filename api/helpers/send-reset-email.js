const nodemailer = require('nodemailer');

// Cache the transporter so a one-off Ethereal account isn't recreated on every send.
let cachedTransporter = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT || '587', 10),
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS }
    });
    return cachedTransporter;
  }

  // No SMTP creds in env — spin up a throwaway Ethereal account so the
  // reset flow works out of the box. Credentials get logged once for reuse.
  const test = await nodemailer.createTestAccount();
  sails.log.info(`[mailer] using ethereal test account: ${test.user} / ${test.pass}`);
  cachedTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: test.user, pass: test.pass }
  });
  return cachedTransporter;
}

module.exports = {

  friendlyName: 'Send reset email',

  description: 'Send a password reset email containing the given URL.',

  inputs: {
    to: { type: 'string', required: true, isEmail: true },
    fullName: { type: 'string', required: true },
    resetUrl: { type: 'string', required: true }
  },

  fn: async function ({ to, fullName, resetUrl }) {
    const transporter = await getTransporter();
    const from = process.env.MAIL_FROM || 'Skeleton Challenge <noreply@skeleton.local>';

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Reset your password',
      text: `Hi ${fullName},\n\nUse the link below to pick a new password (valid for 1 hour):\n\n${resetUrl}\n\nIf you didn't request this, just ignore the email.`,
      html: `<p>Hi ${fullName},</p>
             <p>Use the link below to pick a new password (valid for 1 hour):</p>
             <p><a href="${resetUrl}">${resetUrl}</a></p>
             <p>If you didn't request this, just ignore the email.</p>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      sails.log.info(`[mailer] preview: ${previewUrl}`);
    }
    // Also log the reset URL so the link is reachable even without opening the inbox.
    sails.log.info(`[mailer] reset link for ${to}: ${resetUrl}`);
  }

};
