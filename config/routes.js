/**
 * Route mappings (sails.config.routes)
 *
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /': { action: 'pages/home' },

  // SPA shell — Vue Router takes over on these paths after first paint.
  'GET /login':           { view: 'pages/spa' },
  'GET /signup':          { view: 'pages/spa' },
  'GET /forgot-password': { view: 'pages/spa' },
  'GET /reset-password':  { view: 'pages/spa' },
  'GET /verify-email':    { view: 'pages/spa' },
  'GET /posts/new':       { view: 'pages/spa' },
  'GET /posts/:id/edit':  { view: 'pages/spa' },
  'GET /posts/:id':       { view: 'pages/spa' },

  'POST /api/v1/auth/signup':                 { action: 'auth/signup' },
  'POST /api/v1/auth/login':                  { action: 'auth/login' },
  'POST /api/v1/auth/logout':                 { action: 'auth/logout' },
  'GET  /api/v1/auth/me':                     { action: 'auth/me' },
  'POST /api/v1/auth/forgot-password':        { action: 'auth/forgot-password' },
  'GET  /api/v1/auth/check-reset-token':      { action: 'auth/check-reset-token' },
  'POST /api/v1/auth/reset-password':         { action: 'auth/reset-password' },
  'GET  /api/v1/auth/check-verification-token': { action: 'auth/check-verification-token' },
  'POST /api/v1/auth/verify-email':           { action: 'auth/verify-email' },
  'POST /api/v1/auth/resend-verification':    { action: 'auth/resend-verification' },

  'GET /api/v1/posts':         { action: 'posts/list' },
  'GET /api/v1/posts/:id':     { action: 'posts/get' },
  'POST /api/v1/posts':        { action: 'posts/create' },
  'PATCH /api/v1/posts/:id':   { action: 'posts/update' },
  'DELETE /api/v1/posts/:id':  { action: 'posts/destroy' },

  'POST /api/v1/posts/:postId/comments': { action: 'comments/create' }

};
