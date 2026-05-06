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
    }

  },

  customToJSON: function () {
    const out = { ...this };
    delete out.passwordHash;
    return out;
  }

};
