const nodemailer = require('nodemailer');

// Cache the transporter so a one-off Ethereal account isn't recreated every send.
let cachedTransporter = null;

module.exports = {

  friendlyName: 'Get mailer',

  description: 'Returns a Nodemailer transporter. Uses the SMTP_* env vars when set, otherwise spins up a one-off Ethereal account for local dev.',

  exits: {
    success: { outputType: 'ref' }
  },

  fn: async function () {
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

    const test = await nodemailer.createTestAccount();
    sails.log.info(`[mailer] no SMTP creds — using ethereal test account: ${test.user} / ${test.pass}`);
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass }
    });
    return cachedTransporter;
  }

};
