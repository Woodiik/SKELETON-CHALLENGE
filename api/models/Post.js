/**
 * Post.js
 *
 * Blog post. `deletedAt` is a soft-delete timestamp; queries that should
 * ignore deleted posts must filter `deletedAt: null` (kept explicit on
 * purpose so it's obvious in controllers).
 */

module.exports = {

  attributes: {

    title: {
      type: 'string',
      required: true,
      maxLength: 200
    },

    body: {
      type: 'string',
      required: true,
      columnType: 'text'
    },

    author: {
      model: 'user',
      required: true
    },

    deletedAt: {
      type: 'number',
      allowNull: true
    },

    comments: {
      collection: 'comment',
      via: 'post'
    }

  }

};
