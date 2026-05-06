module.exports = {

  friendlyName: 'Reset password',

  description: 'Exchange a valid reset token for a new password.',

  inputs: {
    token: {
      type: 'string',
      required: true,
      maxLength: 128
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 200
    }
  },

  exits: {
    success: { statusCode: 200 },
    invalid: {
      statusCode: 400,
      description: 'Token is invalid, expired, or already used.'
    }
  },

  fn: async function ({ token, password }) {
    const record = await PasswordResetToken.findOne({ token });
    if (!record || record.usedAt || record.expiresAt < Date.now()) {
      throw 'invalid';
    }

    const passwordHash = await sails.helpers.hashPassword(password);
    const now = Date.now();

    await User.update({ id: record.user }).set({
      passwordHash,
      passwordChangedAt: now
    });
    await PasswordResetToken.update({ id: record.id }).set({ usedAt: now });

    return { ok: true };
  }

};
