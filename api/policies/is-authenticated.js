/**
 * is-authenticated
 *
 * Reads the Bearer token from the Authorization header, verifies it,
 * loads the user and pins it to `req.me`. Anything missing or invalid
 * → 401 with no further detail.
 */

module.exports = async function isAuthenticated(req, res, proceed) {
  const header = req.headers.authorization || '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  let payload;
  try {
    payload = await sails.helpers.jwtVerify(match[1]);
  } catch (err) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const user = await User.findOne({ id: payload.sub });
  if (!user) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  req.me = user;
  return proceed();
};
