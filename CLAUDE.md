# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`viabolat` is a static marketing/landing site for an automation repair & maintenance service. There is **no backend and no application code** — leads are captured via `mailto:` links and an external Google Form. The stack is Eleventy (11ty v3) for HTML generation + a standalone Tailwind CSS v3 build step.

## Commands

```bash
npm start            # Dev server: runs watch:css and `eleventy --serve` concurrently (use this for local work)
npm run build        # Production build: compiles+minifies CSS, then runs Eleventy → _site/
npm run build:css    # Compile Tailwind only (src/assets/css/input.css → styles.css, minified)
npm run watch:css    # Compile Tailwind in watch mode
```

There are no tests, linters, or formatters configured. Do not invent npm scripts for them.

## Build pipeline (the non-obvious part)

CSS and HTML are built by **two separate tools that are not aware of each other**:

1. **Tailwind** compiles `src/assets/css/input.css` → `src/assets/css/styles.css`. The compiled `styles.css` is committed to the repo and lives **inside `src/`**.
2. **Eleventy** then treats `src/assets/` as a passthrough copy (see `.eleventy.js`), so it copies the already-compiled `styles.css` verbatim into `_site/`.

Consequence: if you edit Tailwind classes in templates but don't re-run `build:css` (or aren't running `npm start`), the new classes won't have styles in the output. `npm run build` chains them in the correct order; `npm start` watches both.

## Site structure & templating

- `.eleventy.js`: input `src/`, output `_site/`. Default template engine is **Nunjucks** (`.njk`) for all HTML.
- Pages are `.html` files in `src/` with YAML front matter. Each declares `layout: "base.html"`.
- `src/_includes/base.html` is the single layout — it renders `{{ content }}` and includes `header.html` + `footer.html`. All `<head>` SEO/meta tags are driven by front-matter variables: `title`, `description`, `keywords`, `image`, and `noindex`.
- `src/sitemap.njk` generates `/sitemap.xml` by iterating `collections.all` and **skipping any page with `noindex: true`** in front matter. Setting `noindex` both adds `<meta name="robots" content="noindex">` (via base.html) and removes the page from the sitemap. Use it for the 404 page and any non-public pages.
- Client JS is a single file `src/assets/js/script.js` (mobile menu, smooth scroll) — vanilla, no framework.
- Tailwind config defines custom `primary` (purple) and `secondary` (blue/sky) color scales; prefer these over hardcoded hex.

## Deployment

Pushes to `main` trigger `.github/workflows/deployment.yml`, which runs `npm run build`, **copies `.htaccess` into `_site/`** (Eleventy does not do this — it's a manual step in the workflow), and FTP-deploys `_site/` to HostGator. There is no Vercel/Netlify; the host is Apache.

`.htaccess` is load-bearing for production behavior the static build can't express: it strips `.html` for clean URLs (301), enforces HTTPS, sets cache headers (HTML no-cache, assets 30 days), and maps the 404. When changing routing or URL shape, update `.htaccess` — not just templates.

## Conventions in this repo

- New page = new `.html` in `src/` with the standard front-matter block (`layout`, `title`, `description`, `keywords`, `image`); add `noindex: true` if it should stay out of search and the sitemap.
- `extras/` and `ignore/` are scratch/local-only directories (git-ignored or untracked); don't treat them as part of the site.
- Canonical/OG URLs in `base.html` are hardcoded to `https://viabolat.com`.
