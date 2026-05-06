# Skeleton Challenge — Vue + Sails.js blog

A small blog application built for the test task. Vue 3 on the frontend, Sails.js + PostgreSQL on the backend, JWT auth, posts with comments and soft delete. The home page renders the first 10 posts on the server (EJS); anything past that is fetched and rendered by a Vue component.

## Stack

- **Backend** — Sails.js 1.5, PostgreSQL via Waterline, Sails actions2 for controllers/helpers
- **Frontend** — Vue 3 (Composition API + `<script setup>`), Vue Router, Pinia, Tailwind CSS v4, Vite 5
- **Auth** — JWT (`jsonwebtoken`) + bcrypt (`bcryptjs`)
- **Mail (password reset)** — Nodemailer; falls back to a one-off Ethereal account if no SMTP creds are provided

## Running locally

Requires Node 22+ and a running PostgreSQL.

```bash
# create the database (one-off, name can match what's in DATABASE_URL)
createdb skeleton_challenge

# install deps (root + frontend)
npm install
npm --prefix frontend install

# copy the env template and edit values
cp .env.example .env

# build the frontend bundle (outputs into assets/dist with a manifest)
npm run build

# start sails
npm run dev
```

Then open `http://localhost:1337`.

On the first lift the dev seed (`config/bootstrap.js`) creates two users and ~12 posts so the home page has content. To skip the seed, set `SC_SKIP_SEED=true`. To wipe and reseed, drop and recreate the database.

### Frontend during development

For frontend with auto-rebuild while you edit Vue files, run this in a second terminal — it keeps `assets/dist/` fresh:

```bash
npm --prefix frontend run build -- --watch
```

Sails picks up the new bundle on each request through the manifest, no Sails restart needed.

### Demo credentials

After the seed runs:

```
ada@example.com   /  password123
grace@example.com /  password123
```

## Project layout

```
api/                  Sails controllers, helpers, models, policies
  controllers/
    auth/             signup, login, forgot-password, reset-password
    posts/            list, get, create, update, destroy (soft delete)
    comments/         create
    pages/            home (renders first 10 posts via EJS)
  helpers/            hash-password, check-password, jwt-sign, jwt-verify, send-reset-email
  models/             User, Post, Comment, PasswordResetToken
  policies/           is-authenticated
config/               sails config (routes, datastores, http, models, …)
views/
  layouts/layout.ejs  shared layout, loads the Vite bundle from manifest
  pages/homepage.ejs  SSR home (first 10 posts)
  pages/spa.ejs       shell for SPA routes (login/signup/posts/...)
assets/
  dist/               vite build output, gitignored
frontend/             Vue 3 + Vite project with its own package.json
  src/
    pages/            Login, Signup, ForgotPassword, ResetPassword, Post, PostEditor
    components/       SiteHeader, PostCard, LoadMorePosts
    stores/           auth (Pinia)
    api/              axios client with JWT interceptor
    router/           Vue Router (history mode)
    styles/app.css    Tailwind entry + small set of `@apply` utility classes
```

## How SSR + CSR fit together

`GET /` is the only fully server-rendered page. Sails fetches the first 10 posts and renders them inline through `views/pages/homepage.ejs`. The same page contains a `<div id="more-posts" data-start-page="2">` placeholder; the Vue `LoadMorePosts` component mounts there and pulls subsequent pages from `/api/v1/posts?page=2`.

### How to verify it in 30 seconds

The dev seed creates 16 posts on the first lift, so there's always a CSR tail to load.

1. Open `http://localhost:1337/` and view source (or use DevTools → Network → click the document request → Response). The HTML already contains 10 `<article>` blocks with real titles and bodies — that's the SSR part, no JavaScript needed.
2. Disable JavaScript in DevTools (`Ctrl+Shift+P → Disable JavaScript`) and reload. The same 10 posts are still there. With JS off, the "Load more posts" button is inert — that's the CSR part not running.
3. Re-enable JS, reload, click "Load more posts". DevTools → Network shows a `GET /api/v1/posts?page=2&perPage=10` request, and 6 more posts get appended below the original 10 without a full page reload. That's the CSR part doing its job.

All other UI routes (`/login`, `/signup`, `/posts/:id`, `/posts/new`, `/posts/:id/edit`, …) are SPA routes — Sails serves a small shell (`views/pages/spa.ejs`) and Vue Router takes over.

The site header is a separate Vue mini-app mounted on every page so the auth state stays consistent regardless of how the page got rendered.

## API

All endpoints live under `/api/v1`. JSON in, JSON out. Auth uses `Authorization: Bearer <jwt>`.

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/auth/signup` | – | `{ email, password, fullName }` → `{ token, user }` |
| POST | `/auth/login` | – | `{ email, password }` → `{ token, user }` |
| POST | `/auth/forgot-password` | – | always 200 (no user enumeration) |
| POST | `/auth/reset-password` | – | `{ token, password }` |
| GET  | `/posts` | – | `?page=1&perPage=10` |
| GET  | `/posts/:id` | – | post + comments (with authors) |
| POST | `/posts` | yes | `{ title, body }` |
| PATCH | `/posts/:id` | yes (author) | `{ title?, body? }` |
| DELETE | `/posts/:id` | yes (author) | soft delete (sets `deletedAt`) |
| POST | `/posts/:postId/comments` | yes | `{ body }` |

## Assumptions

- Password reset emails go through whatever SMTP relay you point the app at. The `.env.example` is set up for SendGrid; if `SMTP_USER`/`SMTP_PASS` are left empty the helper falls back to a throwaway [Ethereal](https://ethereal.email) account and logs the preview URL. Either way, the reset link is also printed to the server console so the flow can be exercised without ever opening an inbox.
- Soft delete is a `deletedAt` timestamp. Listing endpoints filter `deletedAt: null` explicitly; this is kept visible in the controllers rather than hidden in the model.
- The default Sails Grunt asset pipeline was dropped — Vite handles all frontend bundling. A small static middleware in `config/http.js` mounts `assets/dist/` at `/dist/` and exposes `viteAsset(entry)` to EJS so the layout can pick up the right hashed filenames from the Vite manifest.
- Authentication is JWT. Sails' built-in session config is still present (Sails wants a session secret to lift) but no session-backed user state is used.
- The dev seed runs on every lift if the DB is empty. In production it's a no-op.
- Editing/deleting comments is not part of the task and isn't implemented. Only post-level edit/soft-delete (author-scoped).

## What I'd do next, given more time

- Tests — at minimum a couple of supertest-style end-to-end happy paths against signup/login/post-create.
- HMR with the Vite dev server (right now dev mode is `vite build --watch` + `node app.js`, which is fine but not snappy).
- Markdown for post bodies (currently plain text rendered with `whitespace-pre-line`).
- Refresh-token rotation on the JWT side; the current TTL defaults to 7d.
- A small admin endpoint for hard-deleting old soft-deleted posts.
