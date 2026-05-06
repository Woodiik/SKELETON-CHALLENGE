# Skeleton Challenge — Vue + Sails.js blog

A small blog built for the test task. Vue 3 on the frontend, Sails.js + PostgreSQL on the backend. The home page renders the first 10 posts on the server through EJS; everything past that is fetched and rendered by a Vue component on the client. Auth uses JWT in an httpOnly cookie.

## Stack

- **Backend** — Sails.js 1.5, Waterline + PostgreSQL, actions2-style controllers and helpers
- **Frontend** — Vue 3 (`<script setup>`), Vue Router, Pinia, Tailwind CSS v4, Vite 5
- **Auth** — JWT in an httpOnly `SameSite=Lax` cookie, bcrypt for hashes; `Authorization: Bearer` is still accepted as a fallback for API clients
- **Mail** — Nodemailer; reads SMTP config from env, falls back to a throwaway [Ethereal](https://ethereal.email) account when no credentials are set

## Running locally

Needs Node 22+ and a Postgres reachable at `DATABASE_URL`. The simplest path is the `docker-compose.yml` in the repo, which runs Postgres on host port `5433` to avoid clashing with anything already on `5432`.

```bash
# install deps (root + frontend live in separate package.json)
npm install
npm --prefix frontend install

# start postgres (or point .env at your own)
docker compose up -d

# env (the example defaults to Ethereal, which works without any setup)
cp .env.example .env

# build the Vue bundle into assets/dist
npm run build

# lift sails
npm run dev
```

The first lift runs `config/bootstrap.js`, which creates two users and 16 posts so the home page actually has content to render and pagination has more than one page. Set `SC_SKIP_SEED=true` to skip it; in production it's a no-op anyway.

```
ada@example.com    /  password123
grace@example.com  /  password123
```

For frontend changes during development, run the Vite watcher in a second terminal — Sails reads the manifest fresh on each request, so no Sails restart is needed:

```bash
npm --prefix frontend run build -- --watch
```

## How SSR + CSR fit together

`GET /` is the only fully server-rendered page. The home controller fetches the first 10 posts and renders them inline through `views/pages/homepage.ejs`. The same page emits a `<div id="more-posts" data-start-page="2">` placeholder; the Vue `LoadMorePosts` component mounts there and pulls subsequent pages from `/api/v1/posts?page=2`.

Every other UI route (`/login`, `/signup`, `/posts/:id`, `/posts/new`, `/posts/:id/edit`, `/verify-email`, `/reset-password`, `/forgot-password`) goes through a small SPA shell — `views/pages/spa.ejs` — and Vue Router takes over from there.

The site header and the email-verification banner are mounted as their own tiny Vue apps on a div in the layout, so the auth state is consistent regardless of whether the underlying page came from EJS or the SPA shell. Pinia is initialised once and shared across all roots on the page.

### Verifying the SSR/CSR split in 30 seconds

The seed creates 16 posts, so there's always six waiting in the CSR tail.

1. Open `http://localhost:1337/` and view source — the HTML already contains 10 `<article>` blocks with real titles and bodies. That's SSR; no JS needed.
2. Disable JavaScript in DevTools (`Ctrl+Shift+P → Disable JavaScript`) and reload. The same 10 posts are there. The "Load more posts" button is inert because Vue isn't running.
3. Turn JS back on, click "Load more posts". Network shows `GET /api/v1/posts?page=2&perPage=10`; six more posts get appended without reloading the page.

## Project layout

```
api/
  controllers/
    auth/             signup, login, logout, me, forgot/reset password,
                      verify/resend verification, plus the matching pre-flight
                      checks used by the frontend pages
    posts/            list, get, create, update, destroy (soft delete)
    comments/         create
    pages/            home (renders the SSR first page)
  helpers/            password hashing, jwt sign/verify, mailer + the two
                      send-* helpers, issue-verification-token
  models/             User, Post, Comment, PasswordResetToken, EmailVerificationToken
  policies/           is-authenticated
  util/               auth-cookie helpers (set/clear/read)
config/               sails config (routes, datastores, http, models, …)
views/
  layouts/layout.ejs  shared layout, loads the Vite bundle through the manifest
  pages/homepage.ejs  SSR home (first 10 posts)
  pages/spa.ejs       shell for SPA routes
assets/dist/          vite build output, gitignored
frontend/             Vue 3 + Vite project with its own package.json
  src/
    pages/            Login, Signup, Forgot/ResetPassword, VerifyEmail,
                      Post, PostEditor
    components/       SiteHeader, VerifyBanner, PostCard, LoadMorePosts,
                      ConfirmDialog, ToastHost
    stores/           auth, toasts (Pinia)
    api/              axios client (cookies via withCredentials)
    router/           Vue Router (history mode)
    styles/app.css    Tailwind entry + a few @apply utility shortcuts
```

## API

All endpoints live under `/api/v1`. JSON in, JSON out. Authenticated routes read the JWT from the `sc_token` cookie first; an `Authorization: Bearer …` header is accepted as a fallback so the API can be poked from curl/Postman without juggling cookies.

| Method | Path                             | Auth         | Notes                                                                                              |
| ------ | -------------------------------- | ------------ | -------------------------------------------------------------------------------------------------- |
| POST   | `/auth/signup`                   | –            | `{ email, password, fullName }` → `{ user }`. Sets the auth cookie. A verification email goes out. |
| POST   | `/auth/login`                    | –            | `{ email, password }` → `{ user }`. Sets the auth cookie.                                          |
| POST   | `/auth/logout`                   | –            | Clears the cookie. Safe to call when not signed in.                                                |
| GET    | `/auth/me`                       | yes          | Returns the authenticated user. Used by the SPA on boot to confirm the cookie is still alive.      |
| POST   | `/auth/forgot-password`          | –            | Always 200, regardless of whether the email exists, so an attacker can't enumerate accounts.       |
| GET    | `/auth/check-reset-token`        | –            | Pre-flight used by the reset page so used/expired links say so up front.                           |
| POST   | `/auth/reset-password`           | –            | `{ token, password }`. Bumps `passwordChangedAt`, which invalidates older JWTs.                    |
| GET    | `/auth/check-verification-token` | –            | Same idea, for the verify page.                                                                    |
| POST   | `/auth/verify-email`             | –            | `{ token }`. Sets `verifiedAt` on the user.                                                        |
| POST   | `/auth/resend-verification`      | yes          | Issues a fresh verification token and emails it. No-op for already-verified accounts.              |
| GET    | `/posts`                         | –            | `?page=1&perPage=10`. Filters out soft-deleted posts. Newest first.                                |
| GET    | `/posts/:id`                     | –            | Post with author and comments (each comment with its author).                                      |
| POST   | `/posts`                         | yes          | `{ title, body }`                                                                                  |
| PATCH  | `/posts/:id`                     | yes (author) | `{ title?, body? }`                                                                                |
| DELETE | `/posts/:id`                     | yes (author) | Soft delete (sets `deletedAt`).                                                                    |
| POST   | `/posts/:postId/comments`        | yes          | `{ body }`                                                                                         |

## Notes on a few decisions

**JWT in an httpOnly cookie, not localStorage.** Anything running on the page can read localStorage; an httpOnly cookie can't be touched by JS at all, so an XSS leak can't exfiltrate the token. With `SameSite=Lax`, cross-site POST/PATCH/DELETE don't carry the cookie either, which covers the common CSRF case without a separate anti-forgery token. The Bearer header is still accepted so the API stays curl-able.

**Password reset invalidates old sessions.** The user has a `passwordChangedAt` timestamp; the auth policy rejects any JWT whose `iat` is older than that. So if someone resets the password through the email link, every previously-issued token stops working without needing a server-side blocklist.

**Email verification is non-blocking.** A freshly-signed-up account is logged in immediately and can browse and write posts. A small yellow banner sits at the top of every page asking them to verify, with a Resend button. The verification email is fired off without `await` — if the SMTP relay is down, that's logged as a warning but signup still succeeds. The reset and verification links are also printed to the sails console so the flows can be exercised without an inbox.

**Soft delete kept explicit.** Posts have a `deletedAt` column instead of a real DELETE. Every list/get controller filters `deletedAt: null` directly — I'd rather see that filter in the controller than have it hidden in some scope/lifecycle hook.

**Vite, not Grunt.** The default Sails template ships a Grunt asset pipeline that's been retired in the wider JS ecosystem for years. I dropped `sails-hook-grunt` and the `tasks/` folder, and Vite emits a manifest into `assets/dist/`. A small middleware in `config/http.js` mounts that folder at `/dist/` and exposes `viteAsset(entry)` to EJS so the layout pulls in the right hashed file names automatically.
