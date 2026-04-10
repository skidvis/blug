# blug

[![GitHub](https://img.shields.io/badge/GitHub-skidvis%2Fblug-24292e?logo=github)](https://github.com/skidvis/blug)

blug is a personal blog built with Astro 6, Vue 3, Tailwind CSS v3, and DaisyUI. It combines a statically prerendered public site with a small SSR admin backend for writing, editing, and publishing markdown posts stored directly in the repository.

## Table of contents

- [Project overview](#project-overview)
- [Stack](#stack)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Environment variables](#environment-variables)
- [Running locally](#running-locally)
- [Docker Compose](#docker-compose)
- [Admin usage](#admin-usage)
- [Content model](#content-model)
- [Scripts](#scripts)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Three-phase implementation plan](#three-phase-implementation-plan)
- [Publishing and deployment overview](#publishing-and-deployment-overview)
- [Important caveats](#important-caveats)

---

## Project overview

The app is split into two main parts:

- **Public site:** statically prerendered Astro pages for posts, tags, search, and RSS. Every public route carries `export const prerender = true`, which is required because the top-level Astro config sets `output: 'server'`.
- **Admin/app server:** SSR Astro routes and API endpoints for login, editing posts, uploads, and publish actions. These are left without `prerender` so they run through the Node standalone server at runtime.

Content lives in the repository as markdown files. The admin UI edits those files in place rather than writing to a database.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Astro 6 (`output: 'server'`, Node adapter standalone mode) |
| UI components | Vue 3 (`@astrojs/vue`) |
| Styling | Tailwind CSS v3 + DaisyUI v4 (custom `light` and `dark` themes) |
| Typography | `@tailwindcss/typography` with a `prose-blug` token-override class |
| Font | Plus Jakarta Sans (Google Fonts, weights 400-800 including italic) |
| Search | Pagefind + `astro-pagefind` integration |
| RSS | `@astrojs/rss` |
| Rich editor | Tiptap v3 (`@tiptap/vue-3`) with `tiptap-markdown` output |
| Auth | `jose` (JWT signing/verification) + `bcryptjs` (password hash) |
| File parsing | `gray-matter` (markdown frontmatter read/write) |
| File uploads | `formidable` |
| Content | Astro Content Collections (`src/content/blog`) |

---

## Features

- **Astro 6 hybrid rendering:** `output: 'server'` globally with explicit `export const prerender = true` on all public routes. Public pages are static; admin and API routes are SSR-only.
- **Custom DaisyUI themes:** hand-tuned `light` and `dark` palettes defined in `tailwind.config.mjs`. Both use confident blue as the primary color, with adjusted contrast ratios for each surface scale.
- **Dark mode toggle:** a navbar button persists the chosen theme to `localStorage` under `blug-theme`. An inline `<head>` script reads that key before first paint to prevent flash-of-wrong-theme.
- **Reading progress bar:** a 2 px fixed bar at the top of the viewport, wired per-page in `PostLayout.astro` via a passive scroll listener.
- **schema.org structured data:** post pages use `itemscope`/`itemprop` attributes for `BlogPosting`, `headline`, `description`, `datePublished`, `dateModified`, `image`, and `articleBody`.
- **Plus Jakarta Sans font:** loaded from Google Fonts and declared as the global `font-sans` stack in both the Tailwind config and a CSS custom property on `:root`.
- **`@tailwindcss/typography`:** applied via the `prose-blug` class, which overrides all prose color tokens for both light and dark themes using `[data-theme="dark"]` selectors.
- **Pagefind full-text search:** indexed at build time, styled to match the DaisyUI theme via CSS custom properties.
- **RSS feed** at `/rss.xml` with autodiscovery `<link>` in every page `<head>`.
- **Tag taxonomy:** tag index at `/tags/` and per-tag archive pages at `/tags/[tag]/`.
- **Draft posts:** excluded from all public listings, static paths, RSS, and Pagefind index.
- **Authenticated admin panel:** single-user login via bcrypt password hash. Protected routes at `/admin/*` and `/api/*` are guarded by Astro middleware using an `httpOnly` JWT cookie.
- **Tiptap editor:** rich text input in the admin UI, saved back to markdown via `tiptap-markdown`.
- **Git-based deploy trigger:** publishing or updating a post can fire a background `git add / commit / push` to trigger a downstream CI build.
- **Docker Compose support:** multi-stage Dockerfile with a smoke-tested `docker compose up --build` workflow.

---

## Requirements

- Node.js `>=22.12.0`
- npm
- A bcrypt hash for the admin password (see Installation)
- For the git deploy trigger: a configured remote and working push credentials on the machine running the server

---

## Installation

```bash
git clone https://github.com/skidvis/blug blug
cd blug
npm install
cp .env.example .env
```

Generate a bcrypt hash for your admin password:

```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 10))"
```

Put the result into `.env` as `ADMIN_PASSWORD_HASH`.

---

## Environment variables

All variables used by the running app:

```env
SITE_URL=https://example.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2b$10$replace-with-generated-bcrypt-hash
JWT_SECRET=replace-with-a-random-secret-at-least-32-characters
GIT_AUTHOR_NAME=blug
GIT_AUTHOR_EMAIL=blug@example.com
```

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical site URL; used in RSS generation and as the Astro `site` fallback |
| `ADMIN_USERNAME` | Admin login username |
| `ADMIN_PASSWORD_HASH` | bcrypt hash checked by `/api/auth/login` |
| `JWT_SECRET` | Signs and verifies the `httpOnly` auth cookie |
| `GIT_AUTHOR_NAME` | Git author name for publish-triggered commits |
| `GIT_AUTHOR_EMAIL` | Git author email for publish-triggered commits |

Also supported at build time:

| Variable | Purpose |
|---|---|
| `ASTRO_SITE` | Overrides `SITE_URL` in `astro.config.mjs`; useful in CI where the deploy URL differs from the local `.env` value |

---

## Running locally

```bash
npm run dev
```

Open:
- Public site: `http://localhost:4321/`
- Admin login: `http://localhost:4321/admin/login`
- Search: `http://localhost:4321/search`

Useful validation commands before committing:

```bash
npm run check     # astro check (TypeScript + template types)
npm run build     # full production build
npm run preview   # preview the built output
```

---

## Docker Compose

A multi-stage Dockerfile and Compose file are included and have been smoke-tested locally.

Build and start:

```bash
docker compose up --build
```

The container runs the Astro standalone server with `HOST=0.0.0.0` and `PORT=4321`. Two bind mounts keep content and uploads writable from the host:

- `./src/content/blog` mounted to `/app/src/content/blog`
- `./public/uploads` mounted to `/app/public/uploads`

The runner stage installs `git` and `openssh-client` because the publish-trigger flow calls `git` inside the container.

Useful Compose commands:

```bash
docker compose config        # validate the compose file
docker compose build         # build the image only
docker compose up -d         # start detached
docker compose ps            # check container status
docker compose logs -f       # tail logs
```

**Dollar-sign escaping in `.env` for Compose:** bcrypt hashes contain `$` characters. Docker Compose interpolates `$` in `.env` files, so each `$` must be doubled:

```env
ADMIN_PASSWORD_HASH=$$2b$$10$$...
```

Smoke-test expectations after `docker compose up --build`:

- `GET /` returns `200`
- `GET /search`, `GET /rss.xml`, `GET /tags/` return `200`
- `GET /admin/login` returns `200`
- `GET /admin/posts` (unauthenticated) redirects to `/admin/login`

---

## Admin usage

### Login

Visit `/admin/login` and submit the username and password configured in `.env`. On success the server sets an `httpOnly` JWT cookie and redirects to `/admin/posts`.

### Manage posts

| Route | Purpose |
|---|---|
| `/admin/posts` | List all posts including drafts |
| `/admin/posts/new` | Create a new post |
| `/admin/posts/[slug]` | Edit an existing post |

### Editor behavior

- Title, description/excerpt, tags, cover image, publish date, and draft toggle are editable.
- Content is written in the Tiptap rich-text editor and saved as markdown via `tiptap-markdown`.
- Inline images upload to `public/uploads/` and are referenced as `/uploads/...`.

### Publish behavior

- New posts go through `POST /api/posts`.
- Existing posts go through `PUT /api/posts/[slug]`.
- When a draft transitions to published, or when an already-published post is saved, the server fires a background sequence: `git add`, `git commit`, `git push origin main`.
- The save response is returned immediately; the git steps run in the background.
- A push failure is logged to stderr and does not roll back the content write.

---

## Content model

Markdown files live in:

```text
src/content/blog/*.md
```

Frontmatter fields:

| Field | Type | Required |
|---|---|---|
| `title` | `string` | yes |
| `description` | `string` | yes |
| `publishDate` | `date` | yes |
| `updatedDate` | `date` | no |
| `coverImage` | `string` | no |
| `tags` | `string[]` | yes |
| `draft` | `boolean` | yes |

Example post:

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

- The filename (without `.md`) is the slug.
- Slugs are generated from the title on creation and do not change on edit.
- `publishDate` is preserved on edits; `updatedDate` is set to the edit timestamp.
- Draft posts are filtered out of all public collections, static path generation, RSS, and Pagefind.

---

## Scripts

```bash
npm run dev          # start Astro dev server
npm run build        # production build
npm run preview      # preview built output via Node adapter
npm run check        # astro check (type + template validation)
npm run astro:check  # same as check, explicit alias
```

---

## Project structure

```text
.
├── .github/workflows/
├── Dockerfile
├── docker-compose.yml
├── ecosystem.config.cjs          # PM2 config for VPS deploy
├── nginx.conf.example
├── public/
│   └── uploads/                  # runtime image uploads
├── src/
│   ├── components/
│   │   ├── admin/                # admin-only Vue components
│   │   ├── PostCard.vue
│   │   ├── SearchBox.vue
│   │   ├── TagChip.vue
│   │   └── TagList.vue
│   ├── content/
│   │   └── blog/                 # markdown posts
│   ├── layouts/
│   │   ├── BaseLayout.astro      # shell: navbar, footer, theme toggle, progress bar
│   │   └── PostLayout.astro      # post shell: schema.org, prose, reading progress
│   ├── lib/
│   │   ├── api.ts                # shared API response helpers
│   │   ├── auth.ts               # JWT sign/verify, bcrypt check
│   │   ├── deploy.ts             # git add/commit/push trigger
│   │   └── posts.ts              # markdown CRUD via gray-matter
│   ├── pages/
│   │   ├── admin/                # SSR admin UI pages
│   │   ├── api/                  # SSR API endpoints
│   │   ├── posts/[...slug].astro # prerendered post pages
│   │   ├── tags/                 # prerendered tag pages
│   │   ├── index.astro           # prerendered homepage
│   │   ├── search.astro          # prerendered search page
│   │   └── rss.xml.ts            # prerendered RSS feed
│   ├── styles/
│   │   └── global.css            # Tailwind layers, prose-blug tokens, Pagefind overrides
│   ├── env.d.ts
│   └── middleware.ts             # JWT auth guard for /admin and /api
├── astro.config.mjs
├── tailwind.config.mjs           # DaisyUI themes, font stack, custom tokens
└── package.json
```

---

## Routes

### Public (prerendered, `export const prerender = true`)

| Route | Description |
|---|---|
| `/` | Homepage with hero, post list, and tag strip |
| `/posts/[slug]` | Individual post page with schema.org markup and reading progress |
| `/tags/` | All tags index |
| `/tags/[tag]/` | Posts filtered by tag |
| `/search` | Pagefind search UI |
| `/rss.xml` | RSS feed |

### Admin (SSR, no `prerender`)

| Route | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin/posts` | Post list including drafts |
| `/admin/posts/new` | New post form |
| `/admin/posts/[slug]` | Edit post form |

### API (SSR, no `prerender`)

| Route | Method(s) | Description |
|---|---|---|
| `/api/auth/login` | `POST` | Verify credentials, set JWT cookie |
| `/api/auth/logout` | `POST` | Clear JWT cookie |
| `/api/posts` | `GET`, `POST` | List or create posts |
| `/api/posts/[slug]` | `GET`, `PUT`, `DELETE` | Read, update, or delete a post |
| `/api/upload` | `POST` | Upload image to `public/uploads/` |

---

## Three-phase implementation plan

The project is structured around three sequential phases:

**Phase 1: Public blog**
Static public site with typed markdown posts, homepage, post pages, tag pages, RSS feed, Pagefind search, and DaisyUI theming. All public routes are prerendered.

**Phase 2: Admin panel**
Authenticated admin UI backed by SSR routes. Includes the Tiptap editor, draft/publish workflow, cover image and inline image uploads, and middleware-protected API endpoints. Adds the Node adapter and switches the Astro output mode to `server`.

**Phase 3: Git-based deploy pipeline**
Publish and update actions trigger a background `git add / commit / push`. A downstream GitHub Actions workflow picks up the push, builds the site, and deploys it to a VPS. nginx serves the static public output; the Astro SSR server (managed by PM2) handles admin and API routes.

Specification documents for each phase are in `docs/ideation/blug/`.

---

## Publishing and deployment overview

The Phase 3 flow end to end:

1. Save or publish a post from the admin UI.
2. The server writes markdown to `src/content/blog/`.
3. If the post is published (or an already-published post is updated), the server calls `triggerDeployForPost` in the background: `git add`, `git commit`, `git push origin main`.
4. The GitHub Actions workflow builds the site and deploys `dist/` to the VPS.
5. nginx serves static public files; `/admin` and `/api` are proxied to the Astro standalone server managed by PM2.

---

## Important caveats

- This is a **single-user** setup. There is no multi-user or role system.
- The `output: 'server'` config means every route is SSR by default. Public routes must explicitly opt into prerendering with `export const prerender = true`.
- Draft posts are excluded from all public surfaces: homepage listing, static path generation, RSS, and Pagefind index.
- Uploaded files land on disk in `public/uploads/`. There is no media library, deduplication, or CDN integration.
- The git push trigger assumes the server environment has a configured remote and working push credentials. Push failure is logged and does not roll back the content save.
- The Docker container includes `git` and `openssh-client`. For the push trigger to work inside the container, the container must also have valid git remote authentication configured.
- Dollar signs in bcrypt hashes must be escaped as `$$` when the hash is stored in `.env` for Docker Compose interpolation.
- Deployment examples (GitHub Actions workflow, nginx config, PM2 config) are reference implementations. Adapt paths, usernames, domain names, and secrets for your environment before use.
