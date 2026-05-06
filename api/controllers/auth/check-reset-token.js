module.exports = {

  friendlyName: 'Check reset token',

  description: 'Lightweight pre-flight check used by the reset-password page so an invalid or already-used token can be reported before the user types a new password.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      maxLength: 128
    }
  },

  exits: {
    success: { statusCode: 200 },
    invalid: {
      statusCode: 400,
      description: 'Token is invalid, expired, or already used.'
    }
  },

  fn: async function ({ token }) {
    const record = await PasswordResetToken.findOne({ token });
    if (!record || record.usedAt || record.expiresAt < Date.now()) {
      throw 'invalid';
    }
    return { ok: true };
  }

};
