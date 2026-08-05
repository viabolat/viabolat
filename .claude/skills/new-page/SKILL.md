---
name: new-page
description: Scaffold a new public page in src/ with the standard front-matter block, correct layout, and the sitemap/routing follow-ups this repo requires.
model: claude-sonnet-5
disable-model-invocation: true
argument-hint: <slug> [page title]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# New Page

Create a new page in `src/`. Adding a page here is a fixed ritual, and every step
has a silent failure mode if skipped — the build never errors on a bad page.

## Steps

1. **Resolve the slug.** `$1` is the filename without extension (`services` →
   `src/services.html`). Refuse if `src/<slug>.html` already exists. Keep the slug
   lowercase-hyphenated — it becomes the public URL `/<slug>` after `.htaccess`
   strips `.html`.

2. **Read a sibling first.** Open `src/about.html` and copy its *actual* front-matter
   shape and section structure. Do not author markup from memory — the design system
   (`section-dark`, `section-tint`, `gradient-mesh`, `reveal`, `card`) is defined in
   `src/assets/css/input.css` and the templates, and it drifts. Match what's there.

3. **Write the page** with this front matter, every key filled in:

```yaml
---
layout: "base.html"
title: "<Page Title> | viabolat"
description: "<120–160 chars, a real sentence, unique across the site>"
keywords: "<comma-separated, specific to this page>"
image: "/assets/images/<page>_logo.png"
---
```

   - `image` must resolve to a real file in `src/assets/images/`. If no page-specific
     image exists, use `/assets/images/debug_logo.png` and say so in your summary
     rather than pointing at a file that isn't there.
   - Add `noindex: true` **only** for non-public pages. It is one switch controlling
     two things: the robots meta in `base.html` *and* exclusion from `src/sitemap.njk`.
     Do not try to noindex a page by editing `sitemap.njk` directly.

4. **Wire up navigation** if the page should be reachable. Header and footer links
   live in `src/_includes/header.html` and `src/_includes/footer.html`. Link to
   `/<slug>` — **never** `/<slug>.html`, which takes a needless 301 through `.htaccess`.

5. **Check `.htaccess`** only if the URL shape is unusual (a redirect from an old
   path, a nested route). Ordinary pages need no change — the existing extensionless
   rule covers them.

6. **Build and verify:**

```bash
npm run build
```

   Then confirm `_site/<slug>/index.html` (or `_site/<slug>.html`) exists and that
   `_site/sitemap.xml` includes `/<slug>` — or excludes it, if you set `noindex`.

7. **Run the reviewers.** Launch `seo-meta-reviewer` and `link-route-checker` and
   report what they find. Fix anything blocking before you call this done.

## Report

State the file created, whether nav was updated, the build result, and the sitemap
outcome. If you substituted a fallback OG image or skipped a nav link, say so —
those are the two things that get silently forgotten.
