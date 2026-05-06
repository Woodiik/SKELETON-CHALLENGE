module.exports = {

  friendlyName: 'Create post',

  description: 'Create a blog post owned by the authenticated user.',

  inputs: {
    title: {
      type: 'string',
      required: true,
      maxLength: 200
    },
    body: {
      type: 'string',
      required: true
    }
  },

  exits: {
    success: { statusCode: 201 }
  },

  fn: async function ({ title, body }) {
    const post = await Post.create({
      title: title.trim(),
      body,
      author: this.req.me.id
    }).fetch();

    return post;
  }

};
