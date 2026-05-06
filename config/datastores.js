/**
 * Datastores (sails.config.datastores)
 *
 * https://sailsjs.com/config/datastores
 */

module.exports.datastores = {

  default: {
    adapter: 'sails-postgresql',
    url: process.env.DATABASE_URL || 'postgres://blog:blog@localhost:5432/skeleton_challenge',
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  }

};
