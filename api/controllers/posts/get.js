module.exports = {

  friendlyName: 'Get post',

  description: 'Get a single non-deleted post with its comments.',

  inputs: {
    id: { type: 'number', required: true }
  },

  exits: {
    success: { statusCode: 200 },
    notFound: { statusCode: 404 }
  },

  fn: async function ({ id }) {
    const post = await Post
      .findOne({ id, deletedAt: null })
      .populate('author')
      .populate('comments', { sort: 'createdAt ASC' });

    if (!post) throw 'notFound';

    // Waterline doesn't deep-populate, so the comment authors come from a follow-up query.
    if (post.comments.length > 0) {
      const authorIds = post.comments.map(c => c.author);
      const authors = await User.find({ id: authorIds });
      const byId = new Map(authors.map(u => [u.id, u]));
      post.comments.forEach(c => { c.author = byId.get(c.author) || null; });
    }

    return post;
  }

};
