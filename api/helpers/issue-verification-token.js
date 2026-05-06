const crypto = require('crypto');

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

module.exports = {

  friendlyName: 'Issue verification token',

  description: 'Create a fresh email verification token for the given user and send the confirmation email.',

  inputs: {
    user: { type: 'ref', required: true }
  },

  fn: async function ({ user }) {
    const token = crypto.randomBytes(32).toString('hex');

    await EmailVerificationToken.create({
      user: user.id,
      token,
      expiresAt: Date.now() + TOKEN_TTL_MS
    });

    const baseUrl = process.env.APP_URL || `http://localhost:${sails.config.port || 1337}`;
    const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

    await sails.helpers.sendVerificationEmail.with({
      to: user.email,
      fullName: user.fullName,
      verifyUrl
    });
  }

};
