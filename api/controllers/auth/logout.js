const { clearAuthCookie } = require('../../util/auth-cookie');

module.exports = {

  friendlyName: 'Logout',

  description: 'Clears the auth cookie. Idempotent — safe to call when not authenticated.',

  exits: {
    success: { statusCode: 200 }
  },

  fn: async function () {
    clearAuthCookie(this.req.res);
    return { ok: true };
  }

};
