/**
 * is-authenticated
 *
 * Reads the JWT from the auth cookie (preferred) or the Authorization
 * header (fallback for API clients), verifies it, loads the user, and
 * pins it to `req.me`. Anything missing or invalid → 401.
 */

const { readAuthCookie } = require('../util/auth-cookie');

module.exports = async function isAuthenticated(req, res, proceed) {
  const cookieToken = readAuthCookie(req);
  const headerMatch = (req.headers.authorization || '').match(/^Bearer\s+(.+)$/i);
  const token = cookieToken || (headerMatch ? headerMatch[1] : null);

  if (!token) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  let payload;
  try {
    payload = await sails.helpers.jwtVerify(token);
  } catch (_err) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await User.findOne({ id: payload.sub });
  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  req.me = user;
  return proceed();
};
