module.exports = {

  friendlyName: 'List posts',

  description: 'Paginated list of non-deleted posts, newest first.',

  inputs: {
    page: { type: 'number', defaultsTo: 1, min: 1 },
    perPage: { type: 'number', defaultsTo: 10, min: 1, max: 50 }
  },

  exits: {
    success: { statusCode: 200 }
  },

  fn: async function ({ page, perPage }) {
    const where = { deletedAt: null };

    const [items, total] = await Promise.all([
      Post
        .find({ where, limit: perPage, skip: (page - 1) * perPage, sort: 'createdAt DESC' })
        .populate('author'),
      Post.count(where)
    ]);

    return {
      items,
      page,
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage))
    };
  }

};
