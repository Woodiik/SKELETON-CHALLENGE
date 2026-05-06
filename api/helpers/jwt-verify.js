const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Verify JWT',

  description: 'Verify a JWT and return its payload, or fail through the `invalid` exit.',

  inputs: {
    token: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: { outputType: 'ref' },
    invalid: { description: 'Token is missing, malformed, expired, or signed with a different secret.' }
  },

  fn: async function ({ token }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not set; cannot verify tokens.');
    }
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw 'invalid';
    }
  }

};
