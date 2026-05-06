/**
 * User.js
 *
 * Account record. `passwordHash` is the bcrypt-hashed password and is
 * stripped from JSON responses by `customToJSON`.
 */

module.exports = {

  // Postgres treats `user` as a reserved word, and sails-postgresql's
  // `migrate: 'alter'` strategy can drop the table and fail to re-create it
  // because of unquoted DDL. Naming the actual table `users` sidesteps that.
  tableName: 'users',

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

    passwordChangedAt: {
      type: 'number',
      defaultsTo: 0,
      description: 'Tokens issued before this timestamp are considered stale and rejected by `is-authenticated`. Bumped on every password reset.'
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
