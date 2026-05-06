const crypto = require('crypto');

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

module.exports = {

  friendlyName: 'Forgot password',

  description: 'Issue a reset token and email it. Always returns 200 so an attacker cannot tell which emails are registered.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    }
  },

  exits: {
    success: { statusCode: 200 }
  },

  fn: async function ({ email }) {
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = Date.now() + TOKEN_TTL_MS;

      await PasswordResetToken.create({
        user: user.id,
        token,
        expiresAt
      });

      const baseUrl = process.env.APP_URL || `http://localhost:${sails.config.port || 1337}`;
      const resetUrl = `${baseUrl}/reset-password?token=${token}`;

      await sails.helpers.sendResetEmail.with({
        to: user.email,
        fullName: user.fullName,
        resetUrl
      });
    }

    return { ok: true };
  }

};
