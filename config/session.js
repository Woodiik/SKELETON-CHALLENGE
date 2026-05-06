/**
 * Session config (sails.config.session)
 *
 * https://sailsjs.com/config/session
 *
 * The app authenticates with JWT, but Sails still wants a session secret
 * configured to lift. The dev fallback below is fine for the test task;
 * production should set SESSION_SECRET in the environment.
 */

module.exports.session = {
  secret: process.env.SESSION_SECRET || 'dev-only-session-secret-change-me'
};
