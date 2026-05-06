/**
 * Shared cookie name + helpers for the JWT auth cookie.
 *
 *   httpOnly: true   — JS can't read it, so an XSS leak can't exfiltrate the token.
 *   sameSite: 'lax'  — sent on top-level navigations and same-origin requests, but
 *                      not on cross-origin POST/PATCH/DELETE, which gives basic
 *                      CSRF protection without a separate token.
 *   secure: prod     — required in production over HTTPS; relaxed in dev.
 */

const COOKIE_NAME = 'sc_token';
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // matches default JWT_TTL

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TTL_MS,
    path: '/'
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}

function readAuthCookie(req) {
  return req.cookies && req.cookies[COOKIE_NAME];
}

module.exports = { COOKIE_NAME, setAuthCookie, clearAuthCookie, readAuthCookie };
