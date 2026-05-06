/**
 * Policy mappings (sails.config.policies)
 *
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  '*': true,

  'posts/create':  'is-authenticated',
  'posts/update':  'is-authenticated',
  'posts/destroy': 'is-authenticated',

  'comments/create': 'is-authenticated'

};
