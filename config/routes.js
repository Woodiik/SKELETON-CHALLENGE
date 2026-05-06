/**
 * Route mappings (sails.config.routes)
 *
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /': { view: 'pages/homepage' },

  'POST /api/v1/auth/signup':          { action: 'auth/signup' },
  'POST /api/v1/auth/login':           { action: 'auth/login' },
  'POST /api/v1/auth/forgot-password': { action: 'auth/forgot-password' },
  'POST /api/v1/auth/reset-password':  { action: 'auth/reset-password' }

  // posts + comments routes land alongside their controllers

};
