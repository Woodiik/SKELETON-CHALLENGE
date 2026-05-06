const nodemailer = require('nodemailer');

module.exports = {

  friendlyName: 'Send verification email',

  description: 'Send an email-confirmation link to a freshly-signed-up user (or anyone hitting /auth/resend-verification).',

  inputs: {
    to: { type: 'string', required: true, isEmail: true },
    fullName: { type: 'string', required: true },
    verifyUrl: { type: 'string', required: true }
  },

  fn: async function ({ to, fullName, verifyUrl }) {
    const transporter = await sails.helpers.getMailer();
    const from = process.env.MAIL_FROM || 'Skeleton Challenge <noreply@skeleton.local>';

    const info = await transporter.sendMail({
      from,
      to,
      subject: 'Confirm your email',
      text: `Hi ${fullName},\n\nThanks for signing up. Click the link below to confirm your email address (valid for 24 hours):\n\n${verifyUrl}\n\nIf you didn't sign up, you can safely ignore this email.`,
      html: `<p>Hi ${fullName},</p>
             <p>Thanks for signing up. Click the link below to confirm your email address (valid for 24 hours):</p>
             <p><a href="${verifyUrl}">${verifyUrl}</a></p>
             <p>If you didn't sign up, you can safely ignore this email.</p>`
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) sails.log.info(`[mailer] preview: ${previewUrl}`);
    sails.log.info(`[mailer] verify link for ${to}: ${verifyUrl}`);
  }

};
