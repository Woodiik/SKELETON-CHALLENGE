module.exports = {

  friendlyName: 'Current user',

  description: 'Returns the currently authenticated user. Useful for the frontend to refresh its cached state after server-side changes (verification, password reset, …).',

  exits: {
    success: { statusCode: 200 }
  },

  fn: async function () {
    return this.req.me;
  }

};
