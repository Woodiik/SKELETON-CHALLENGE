const bcrypt = require('bcryptjs');

module.exports = {

  friendlyName: 'Check password',

  inputs: {
    password: {
      type: 'string',
      required: true
    },
    hash: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: { outputType: 'boolean' }
  },

  fn: async function ({ password, hash }) {
    return bcrypt.compare(password, hash);
  }

};
