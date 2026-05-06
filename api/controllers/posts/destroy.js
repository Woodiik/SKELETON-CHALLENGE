module.exports = {

  friendlyName: 'Delete post',

  description: 'Soft-delete a post the user owns (sets deletedAt).',

  inputs: {
    id: { type: 'number', required: true }
  },

  exits: {
    success: { statusCode: 204 },
    notFound: { statusCode: 404 },
    forbidden: { statusCode: 403 }
  },

  fn: async function ({ id }) {
    const post = await Post.findOne({ id, deletedAt: null });
    if (!post) throw 'notFound';
    if (post.author !== this.req.me.id) throw 'forbidden';

    await Post.updateOne({ id }).set({ deletedAt: Date.now() });
  }

};
