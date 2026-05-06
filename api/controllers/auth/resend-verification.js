module.exports = {

  friendlyName: 'Resend verification email',

  description: 'Issue a fresh verification token and email it to the authenticated user. Idempotent — already-verified accounts return 200 without sending anything.',

  exits: {
    success: { statusCode: 200 }
  },

  fn: async function () {
    const me = this.req.me;

    if (me.verifiedAt) {
      return { ok: true, alreadyVerified: true };
    }

    await sails.helpers.issueVerificationToken.with({ user: me });

    return { ok: true };
  }

};
