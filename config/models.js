/**
 * Default model settings (sails.config.models)
 *
 * https://sailsjs.com/docs/concepts/models-and-orm/model-settings
 */

module.exports.models = {

  schema: true,

  // 'alter' auto-syncs the schema on lift in dev. In production this is
  // forced to 'safe' by sails regardless of what's set here, so manual
  // migrations would be the path forward when this leaves the test stage.
  migrate: 'alter',

  attributes: {
    id: { type: 'number', autoIncrement: true },
    createdAt: { type: 'number', autoCreatedAt: true },
    updatedAt: { type: 'number', autoUpdatedAt: true }
  },

  dataEncryptionKeys: {
    default: process.env.DEK_DEFAULT || 'DFLTQz4dL3lfG03ZJSwZHj4IiTBoOk1LFpSon0Zfcys='
  },

  cascadeOnDestroy: true

};
