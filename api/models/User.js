/**
 * User.js
 *
 * Account record. `passwordHash` is the bcrypt-hashed password and is
 * stripped from JSON responses by `customToJSON`.
 */

module.exports = {

  attributes: {

    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200
    },

    fullName: {
      type: 'string',
      required: true,
      maxLength: 120
    },

    passwordHash: {
      type: 'string',
      required: true,
      protect: true
    },

    verifiedAt: {
      type: 'number',
      allowNull: true,
      description: 'Timestamp when the user clicked the link in their verification email. Null until verified.'
    },

    posts: {
      collection: 'post',
      via: 'author'
    },

    comments: {
      collection: 'comment',
      via: 'author'
    },

    resetTokens: {
      collection: 'passwordresettoken',
      via: 'user'
    },

    verificationTokens: {
      collection: 'emailverificationtoken',
      via: 'user'
    }

  },

  customToJSON: function () {
    const out = { ...this };
    delete out.passwordHash;
    return out;
  }

};
