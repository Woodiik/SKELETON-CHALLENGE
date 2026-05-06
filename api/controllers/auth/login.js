module.exports = {

  friendlyName: 'Login',

  description: 'Verify credentials and return a JWT.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true
    },
    password: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: { statusCode: 200 },
    invalid: {
      statusCode: 401,
      description: 'Wrong email or password.'
    }
  },

  fn: async function ({ email, password }) {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      throw 'invalid';
    }

    const ok = await sails.helpers.checkPassword(password, user.passwordHash);
    if (!ok) {
      throw 'invalid';
    }

    const token = await sails.helpers.jwtSign(user.id);

    return { token, user };
  }

};
