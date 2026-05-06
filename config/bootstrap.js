/**
 * Seed function (sails.config.bootstrap)
 *
 * Runs once on each lift. In dev, drops a small set of users/posts/comments
 * if the DB is empty so the home page actually has something to render
 * (and pagination has more than one page to load).
 *
 * Skipped in production and when SC_SKIP_SEED=true.
 *
 * https://sailsjs.com/config/bootstrap
 */

const SAMPLE_POSTS = [
  { title: 'Welcome to the Skeleton blog',
    body: 'This is the first post — it lands here as part of the dev seed so the home page has something to render.\n\nFeel free to delete it and write your own.' },
  { title: 'Hybrid SSR + CSR, in practice',
    body: 'The first 10 posts you see on the home page were rendered on the server with EJS. Anything past that is fetched and rendered by a Vue component once you hit “Load more”.' },
  { title: 'Why we kept Sails',
    body: 'Sails feels old-school next to a modern Nest or Fastify app, but for a blog with a small surface and an EJS layout, it fits like a glove. Waterline + Postgres did the heavy lifting here.' },
  { title: 'Vite over Grunt',
    body: 'The default Sails template ships with a Grunt asset pipeline. We swapped it for Vite — outputs into assets/dist with a manifest, and the EJS layout reads it to inject the right hashed file names.' },
  { title: 'JWT, briefly',
    body: 'Sessions would have been simpler. We went with JWT because the task asked for it and because it lets the API stay stateless if it ever grows past the blog.' },
  { title: 'On password resets',
    body: 'The reset flow uses Nodemailer. With real SMTP creds (SendGrid here) it sends actual mail; without them, it falls back to a one-off Ethereal account and logs the preview URL.' },
  { title: 'Soft delete, kept honest',
    body: 'Posts have a deletedAt timestamp instead of a real DELETE. The list endpoint filters where deletedAt is null. We kept that explicit instead of hiding it in the model.' },
  { title: 'Tailwind v4 first impressions',
    body: 'No tailwind.config.js, just an @import in CSS and a Vite plugin. Felt strange for ten minutes, then refreshing.' },
  { title: 'Pinia is the right default',
    body: 'Pinia has all the things Vuex tried to do, with about a third of the boilerplate. The auth store here is ~50 lines and does login, signup, reset and logout.' },
  { title: 'How comments hang off posts',
    body: 'A comment has model: post and model: author. The post detail endpoint populates both; the create endpoint inlines the author so the UI can render the new comment without an extra round trip.' },
  { title: 'Pagination, the boring way',
    body: 'limit + skip, sorted by createdAt desc. There are fancier cursor-based approaches but for ~100 posts a page-and-perPage will do.' },
  { title: 'What I would do next',
    body: 'Tests, a small admin view, maybe Markdown for post bodies, and a refresh-token rotation on the JWT side. Out of scope for the test, but listed here as TODOs.' },
  { title: 'Why bother with email verification',
    body: 'Verifying email addresses keeps the user list real and lets us ship transactional mail (resets, notifications) without bouncing. The flow here issues a one-time token on signup and exchanges it for a verifiedAt timestamp.' },
  { title: 'Cookies vs localStorage for the JWT',
    body: 'localStorage is the simplest place to keep a token, but anything running on the page can read it. An httpOnly cookie with SameSite=Lax avoids that — JS never sees the value, the browser ships it on every same-origin request.' },
  { title: 'Tiny things matter',
    body: 'Pre-checking a reset token before showing the form, custom confirm dialogs, optimistic UI for new comments — none of this is in the spec, but the gap between "works" and "feels right" lives in these.' },
  { title: 'Closing thoughts',
    body: 'A blog is a deceptively easy task: half a day for the happy paths, another day for the edges. The interesting bits ended up being the SSR + CSR split, the manifest-driven asset wiring, and the auth UX.' }
];

const SAMPLE_COMMENTS = [
  { postIndex: 0, body: 'Nice setup — clean separation between the SSR and the CSR parts.' },
  { postIndex: 1, body: 'Didn\'t expect EJS in 2026 but honestly it works great here.' },
  { postIndex: 3, body: 'Vite + Sails is the right call. Grunt was hurting.' },
  { postIndex: 9, body: 'The inlined author on create is a nice touch.' }
];

module.exports.bootstrap = async function () {

  if (process.env.NODE_ENV === 'production') return;
  if (process.env.SC_SKIP_SEED === 'true') return;

  const existingUsers = await User.count();
  if (existingUsers > 0) return;

  sails.log.info('[seed] empty database — creating sample users, posts and comments…');

  const passwordHash = await sails.helpers.hashPassword('password123');

  const ada = await User.create({
    email: 'ada@example.com',
    fullName: 'Ada Lovelace',
    passwordHash
  }).fetch();

  const grace = await User.create({
    email: 'grace@example.com',
    fullName: 'Grace Hopper',
    passwordHash
  }).fetch();

  const authors = [ada, grace];
  const createdPosts = [];

  for (let i = 0; i < SAMPLE_POSTS.length; i++) {
    const post = await Post.create({
      ...SAMPLE_POSTS[i],
      author: authors[i % authors.length].id
    }).fetch();
    createdPosts.push(post);
  }

  for (const c of SAMPLE_COMMENTS) {
    const target = createdPosts[c.postIndex];
    if (!target) continue;
    await Comment.create({
      body: c.body,
      post: target.id,
      author: authors[(c.postIndex + 1) % authors.length].id
    });
  }

  sails.log.info(`[seed] done — ${createdPosts.length} posts, ${SAMPLE_COMMENTS.length} comments. Login: ada@example.com / password123`);

};
