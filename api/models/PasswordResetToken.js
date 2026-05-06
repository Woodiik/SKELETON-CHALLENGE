/**
 * PasswordResetToken.js
 *
 * Short-lived single-use token issued from /auth/forgot-password.
 * `usedAt` is set the moment the token gets exchanged for a new password
 * so it cannot be replayed.
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
