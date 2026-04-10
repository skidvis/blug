# blug

blug is a personal blog built with Astro, Vue, Tailwind, and DaisyUI. It combines a static public site with a small SSR admin backend for writing, editing, and publishing markdown posts stored directly in the repo.

Current implementation features:
- public blog with RSS, tags, and Pagefind search
- authenticated admin UI at `/admin`
- markdown file CRUD in `src/content/blog`
- image uploads to `public/uploads`
- publish/update flow that can trigger git commit + push for deployment
- deployment docs and example VPS/GitHub Actions config

## Project overview

The app is split into two main parts:

- **Public site**: static Astro pages for posts, tags, search, and RSS
- **Admin/app server**: SSR Astro routes and API endpoints for login, editing posts, uploads, and publish actions

Content lives in the repository as markdown files. The admin UI edits those files instead of writing to a database.

## Key features

- Markdown blog posts with typed frontmatter
- Public homepage, post pages, tag pages, RSS feed, and Pagefind search
- Single-user admin auth using username/password from environment variables
- JWT auth cookie with middleware protection for `/admin` and `/api`
- Rich-text post editor built with Tiptap + markdown output
- Cover image uploads and inline image uploads
- Draft vs published post workflow
- Stable slug behavior: slug is generated on create and does not change on edit
- Publish/update of published posts can trigger git add/commit/push
- Example deploy workflow for GitHub Actions + PM2 + nginx

## Stack

- **Astro 4** in hybrid output mode
- **Vue 3** for interactive components
- **Tailwind CSS + DaisyUI** for styling
- **Astro Content Collections** for public content loading
- **Tiptap** with `tiptap-markdown` for admin editing
- **jose** for JWT signing/verification
- **bcryptjs** for password hash verification
- **gray-matter** for markdown file parsing/writing
- **Pagefind** for static search indexing
- **Node adapter** for SSR/admin/API routes

## Requirements

- Node.js `>=22.12.0`
- npm
- A bcrypt password hash for admin login
- For publish/deploy flow: a git remote configured and working push credentials on the machine running the admin server

## Installation

```bash
git clone <your-repo-url> blug
cd blug
npm install
cp .env.example .env
```

Generate a bcrypt hash for your admin password:

```bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10))"
```

Put that hash into `.env` as `ADMIN_PASSWORD_HASH`.

## Environment variables

Current app env vars used by the code:

```env
SITE_URL=https://example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$replace-with-generated-bcrypt-hash
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
GIT_AUTHOR_NAME=blug
GIT_AUTHOR_EMAIL=blug@example.com
```

What they do:
- `SITE_URL`: canonical site URL used by the app/build, including RSS generation fallback paths
- `ADMIN_USERNAME`: admin login username
- `ADMIN_PASSWORD_HASH`: bcrypt hash checked by `/api/auth/login`
- `JWT_SECRET`: secret used to sign/verify the auth cookie
- `GIT_AUTHOR_NAME`: git author name used for publish-triggered commits
- `GIT_AUTHOR_EMAIL`: git author email used for publish-triggered commits

Also supported at build/deploy time:
- `ASTRO_SITE`: used by `astro.config.mjs` for deploy/build environments; falls back to `SITE_URL`

## Running locally

Start the dev server:

```bash
npm run dev
```

Open:
- public site: `http://localhost:4321/`
- admin login: `http://localhost:4321/admin/login`
- search: `http://localhost:4321/search`

Useful validation commands:

```bash
npm run check
npm run astro:check
npm run build
npm run preview
```

## Docker Compose

A conservative production-style Docker Compose setup is included and has been smoke-tested locally.

Build and start the app:

```bash
docker compose up --build
```

The containerized app was verified at:
- `http://localhost:4321/`

This setup runs the Astro standalone server with:
- `.env` loaded into the container
- `HOST=0.0.0.0` and `PORT=4321`
- bind-mounted persistence for:
  - `src/content/blog`
  - `public/uploads`

Useful Docker commands:

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f
```

Compose/.env note:
- bcrypt hashes contain `$` characters
- when storing `ADMIN_PASSWORD_HASH` in `.env` for Docker Compose, escape `$` as `$$`
- example:
  ```env
  ADMIN_PASSWORD_HASH=$$2b$$10$$...
  ```

Practical smoke-test expectations:
- `/`, `/search`, `/rss.xml`, `/tags`, one tag route, and one post route should return `200`
- `/admin/login` should return `200`
- protected admin routes like `/admin/posts` should redirect to `/admin/login` when unauthenticated

Notes:
- The container includes `git` and `openssh-client` because published post updates may trigger git commit/push
- For Phase 3 publish-trigger behavior to work inside the container, the container environment must also have working git remote/auth access

## Admin usage

### Login
- Visit `/admin/login`
- Submit `ADMIN_USERNAME` and the password matching `ADMIN_PASSWORD_HASH`
- On success, the app sets an `httpOnly` JWT cookie and redirects to `/admin/posts`

### Manage posts
- `/admin/posts` lists all posts, including drafts
- `/admin/posts/new` creates a new post
- `/admin/posts/[slug]` edits an existing post

### Editor behavior
- Title, excerpt/description, tags, cover image, publish date, and draft state are editable
- Content is edited in a Tiptap-based rich editor but saved as markdown
- Images upload to `/public/uploads` and are referenced as `/uploads/...`

### Publish behavior
- New posts are created through `POST /api/posts`
- Existing posts are updated through `PUT /api/posts/[slug]`
- When a draft is changed to published, or when an already-published post is updated, the server attempts to:
  - `git add`
  - `git commit`
  - `git push origin main`
- Post save success is independent from deploy success
- Push failures are logged and do not roll back the content save

## Content model

Markdown files live in:

```text
src/content/blog/*.md
```

Public content schema is defined in `src/content/config.ts`.

Frontmatter fields currently supported:
- `title: string`
- `description: string`
- `publishDate: date`
- `updatedDate?: date`
- `coverImage?: string`
- `tags: string[]`
- `draft: boolean`

Example:

```md
---
title: Hello Astro
description: First post in blug
publishDate: 2026-04-09
updatedDate: 2026-04-10
coverImage: /uploads/hero.jpg
tags:
  - astro
  - intro
draft: false
---

Welcome to **blug**.
```

Notes:
- The filename becomes the slug
- New slugs are generated from the title when creating a post
- Slugs do not change when editing
- `publishDate` is preserved on edits
- `updatedDate` is set on update operations

## Scripts

Actual scripts in `package.json`:

- `npm run dev` — start Astro dev server
- `npm run build` — build the site
- `npm run preview` — preview the built site
- `npm run check` — run `astro check`
- `npm run astro:check` — explicit `astro check`
- `npm run astro -- check` — also supported, but prefer the direct scripts above

## Project structure

```text
.
├── .github/workflows/deploy.yml
├── DEPLOY.md
├── docs/ideation/blug/
├── ecosystem.config.cjs
├── nginx.conf.example
├── public/
│   └── uploads/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   └── ...
│   ├── content/
│   │   ├── blog/
│   │   └── config.ts
│   ├── layouts/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── deploy.ts
│   │   └── posts.ts
│   ├── pages/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── posts/
│   │   ├── rss.xml.ts
│   │   ├── search.astro
│   │   └── tags/
│   ├── env.d.ts
│   └── middleware.ts
├── astro.config.mjs
├── package.json
└── README.md
```

Important routes:
- `/` — homepage
- `/posts/[slug]` — public post pages
- `/tags` and `/tags/[tag]` — tag listings
- `/search` — Pagefind search page
- `/rss.xml` — RSS feed
- `/admin/login` — login page
- `/admin/posts` — admin post list
- `/admin/posts/new` — new post page
- `/admin/posts/[slug]` — edit post page
- `/api/auth/login` — login handler
- `/api/auth/logout` — logout handler
- `/api/posts` — admin post list/create API
- `/api/posts/[slug]` — admin read/update/delete API
- `/api/upload` — image upload API

## Publishing and deployment overview

The Phase 3 flow is:
1. Save or publish a post from the admin UI
2. The server writes markdown to `src/content/blog`
3. If the post is published, or an already-published post is updated, the server attempts a git commit + push
4. The configured GitHub Actions workflow builds the site and deploys `dist/client/` to the VPS
5. nginx serves static public files, while `/admin` and `/api` are proxied to the Astro SSR server managed by PM2

Deployment-related files in this repo:
- `DEPLOY.md` — practical setup and rollout guide
- `.github/workflows/deploy.yml` — example GitHub Actions pipeline
- `ecosystem.config.cjs` — PM2 config
- `nginx.conf.example` — example nginx site config

See also:
- [`DEPLOY.md`](./DEPLOY.md)
- [`docs/ideation/blug/spec-phase-1.md`](./docs/ideation/blug/spec-phase-1.md)
- [`docs/ideation/blug/spec-phase-2.md`](./docs/ideation/blug/spec-phase-2.md)
- [`docs/ideation/blug/spec-phase-3.md`](./docs/ideation/blug/spec-phase-3.md)
- [`docs/ideation/blug/contract.md`](./docs/ideation/blug/contract.md)

## Important caveats

- This is a **single-user** blog/admin setup
- Admin and API routes require SSR; public content remains static-first
- Draft posts are excluded from public listings, post routes, RSS, and search builds
- Uploaded files are stored on disk in `public/uploads`; there is no media library UI
- The publish pipeline assumes the server environment can push to the configured git remote
- Git push failure does not fail the save request; check server logs if deploys do not happen
- Build/deploy examples are implementation-aware, but still examples; adapt paths, usernames, domain names, and secrets for your environment
- The GitHub Actions workflow and VPS runtime env are related but separate concerns
