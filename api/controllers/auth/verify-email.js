module.exports = {

  friendlyName: 'Verify email',

  description: 'Exchange a verification token for a verifiedAt timestamp on the user.',

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
    const record = await EmailVerificationToken.findOne({ token });
    if (!record || record.usedAt || record.expiresAt < Date.now()) {
      throw 'invalid';
    }

    const verifiedAt = Date.now();

    await User.update({ id: record.user }).set({ verifiedAt });
    await EmailVerificationToken.update({ id: record.id }).set({ usedAt: verifiedAt });

    return { ok: true };
  }

};
