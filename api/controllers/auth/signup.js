module.exports = {

  friendlyName: 'Signup',

  description: 'Create a new user account and return a JWT.',

  inputs: {
    email: {
      type: 'string',
      required: true,
      isEmail: true,
      maxLength: 200
    },
    password: {
      type: 'string',
      required: true,
      minLength: 8,
      maxLength: 200
    },
    fullName: {
      type: 'string',
      required: true,
      maxLength: 120
    }
  },

  exits: {
    success: { statusCode: 201 },
    emailTaken: {
      statusCode: 409,
      description: 'A user with this email already exists.'
    }
  },

  fn: async function (inputs) {
    const email = inputs.email.trim().toLowerCase();

    const existing = await User.findOne({ email });
    if (existing) {
      throw 'emailTaken';
    }

    const passwordHash = await sails.helpers.hashPassword(inputs.password);

    const user = await User.create({
      email,
      fullName: inputs.fullName.trim(),
      passwordHash
    }).fetch();

    const token = await sails.helpers.jwtSign(user.id);

    return { token, user };
  }

};
