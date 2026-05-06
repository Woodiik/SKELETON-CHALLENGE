const jwt = require('jsonwebtoken');

module.exports = {

  friendlyName: 'Sign JWT',

  description: 'Sign a JSON Web Token for the given user id.',

  inputs: {
    userId: {
      type: 'number',
      required: true
    }
  },

  exits: {
    success: { outputType: 'string' }
  },

  fn: async function ({ userId }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not set; cannot sign tokens.');
    }
    const ttl = process.env.JWT_TTL || '7d';
    return jwt.sign({ sub: userId }, secret, { expiresIn: ttl });
  }

};
