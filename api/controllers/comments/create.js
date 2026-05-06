module.exports = {

  friendlyName: 'Add comment',

  description: 'Attach a comment to a post on behalf of the authenticated user.',

  inputs: {
    postId: {
      type: 'number',
      required: true
    },
    body: {
      type: 'string',
      required: true,
      maxLength: 2000
    }
  },

  exits: {
    success: { statusCode: 201 },
    notFound: { statusCode: 404 }
  },

  fn: async function ({ postId, body }) {
    const post = await Post.findOne({ id: postId, deletedAt: null });
    if (!post) throw 'notFound';

    const comment = await Comment.create({
      body,
      post: post.id,
      author: this.req.me.id
    }).fetch();

    // Inline the author so the UI can render the new comment without an extra round trip.
    return { ...comment, author: this.req.me };
  }

};
