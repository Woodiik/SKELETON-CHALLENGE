/**
 * Policy mappings (sails.config.policies)
 *
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': true

  // Per-action overrides land here as protected endpoints are added,
  // e.g. 'posts/create': 'is-authenticated'.

};
