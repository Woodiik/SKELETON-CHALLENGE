/**
 * Comment.js
 */

module.exports = {

  attributes: {

    body: {
      type: 'string',
      required: true,
      maxLength: 2000
    },

    post: {
      model: 'post',
      required: true
    },

    author: {
      model: 'user',
      required: true
    }

  }

};
