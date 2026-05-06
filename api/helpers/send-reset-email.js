const nodemailer = require('nodemailer');

module.exports = {

  friendlyName: 'Send reset email',

  description: 'Send a password reset email containing the given URL.',

  inputs: {
    to: { type: 'string', required: true, isEmail: true },
    fullName: { type: 'string', required: true },
    resetUrl: { type: 'string', required: true }
  },

  fn: async function ({ to, fullName, resetUrl }) {
    const transporter = await sails.helpers.getMailer();
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
    if (previewUrl) sails.log.info(`[mailer] preview: ${previewUrl}`);
    sails.log.info(`[mailer] reset link for ${to}: ${resetUrl}`);
  }

};
