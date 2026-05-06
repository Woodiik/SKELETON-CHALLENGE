module.exports = {

  friendlyName: 'Update post',

  description: 'Edit title and/or body of a post the user owns.',

  inputs: {
    id: { type: 'number', required: true },
    title: { type: 'string', maxLength: 200 },
    body: { type: 'string' }
  },

  exits: {
    success: { statusCode: 200 },
    notFound: { statusCode: 404 },
    forbidden: { statusCode: 403 }
  },

  fn: async function ({ id, title, body }) {
    const post = await Post.findOne({ id, deletedAt: null });
    if (!post) throw 'notFound';
    if (post.author !== this.req.me.id) throw 'forbidden';

    const patch = {};
    if (title !== undefined) patch.title = title.trim();
    if (body !== undefined) patch.body = body;

    if (Object.keys(patch).length === 0) {
      return post;
    }

    return Post.updateOne({ id }).set(patch);
  }

};
