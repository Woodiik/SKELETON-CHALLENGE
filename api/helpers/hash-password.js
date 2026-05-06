const bcrypt = require('bcryptjs');

module.exports = {

  friendlyName: 'Hash password',

  inputs: {
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: { outputType: 'string' }
  },

  fn: async function ({ password }) {
    return bcrypt.hash(password, 10);
  }

};
