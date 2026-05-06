module.exports = {

  friendlyName: 'Check verification token',

  description: 'Pre-flight check used by the verify-email page so an invalid or already-used link can be reported up front.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      maxLength: 128
    }
  },

  exits: {
    success: { statusCode: 200 },
    invalid: { statusCode: 400 }
  },

  fn: async function ({ token }) {
    const record = await EmailVerificationToken.findOne({ token });
    if (!record || record.usedAt || record.expiresAt < Date.now()) {
      throw 'invalid';
    }
    return { ok: true };
  }

};
