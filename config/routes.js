/**
 * Route mappings (sails.config.routes)
 *
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /': { action: 'pages/home' },

  'POST /api/v1/auth/signup':          { action: 'auth/signup' },
  'POST /api/v1/auth/login':           { action: 'auth/login' },
  'POST /api/v1/auth/forgot-password': { action: 'auth/forgot-password' },
  'POST /api/v1/auth/reset-password':  { action: 'auth/reset-password' },

  'GET /api/v1/posts':         { action: 'posts/list' },
  'GET /api/v1/posts/:id':     { action: 'posts/get' },
  'POST /api/v1/posts':        { action: 'posts/create' },
  'PATCH /api/v1/posts/:id':   { action: 'posts/update' },
  'DELETE /api/v1/posts/:id':  { action: 'posts/destroy' },

  'POST /api/v1/posts/:postId/comments': { action: 'comments/create' }

};
