/**
 * EmailVerificationToken.js
 *
 * Issued on signup (and on /auth/resend-verification). Single-use:
 * `usedAt` is set when the token is exchanged for a `verifiedAt`
 * timestamp on the User.
 */

module.exports = {

  attributes: {

    token: {
      type: 'string',
      required: true,
      unique: true,
      maxLength: 128
    },

    user: {
      model: 'user',
      required: true
    },

    expiresAt: {
      type: 'number',
      required: true
    },

    usedAt: {
      type: 'number',
      allowNull: true
    }

  }

};
