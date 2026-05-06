const PAGE_SIZE = 10;

module.exports = {

  friendlyName: 'Home page',

  description: 'Render the home page with the first 10 non-deleted posts inlined as HTML.',

  exits: {
    success: {
      viewTemplatePath: 'pages/homepage'
    }
  },

  fn: async function () {
    const where = { deletedAt: null };

    const [posts, total] = await Promise.all([
      Post
        .find({ where, limit: PAGE_SIZE, sort: 'createdAt DESC' })
        .populate('author'),
      Post.count(where)
    ]);

    return {
      pageTitle: 'Skeleton Challenge — Blog',
      posts,
      total,
      hasMore: total > PAGE_SIZE,
      nextPage: 2,
      pageSize: PAGE_SIZE
    };
  }

};
