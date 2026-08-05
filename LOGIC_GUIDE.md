# LOGIC_GUIDE.md

## Purpose
Tracks architectural decisions, non-obvious tradeoffs, and resolved bugs across sessions.
Update immediately when: architecture shifts, a tradeoff is made, a recurring bug is resolved.
Do not defer updates to end-of-session.

## Entries

### [YYYY-MM-DD] — [Decision Title]
**What:**
**Why:**
**Alternatives rejected:**
**Accepted risks:**

### 2026-08-05 — Extended cache-busting from CSS/JS to images and video
**What:** Added a `| bust` Nunjucks filter in `.eleventy.js` that appends an
8-char MD5 content hash to any site-absolute `/assets/...` path. Applied to the
favicon, the header/footer logo, and both video posters / `<source>` / download
links. CSS and JS keep using the existing `src/_data/assetVersion.js`.

**Why:** `.htaccess` caches everything under `/assets` for 30 days against
stable filenames while HTML is `no-cache`. That was already solved for CSS/JS,
but images and the two ~3.5MB videos were not — swapping one in place would
leave returning visitors on the old file for up to a month with no signal.

**Alternatives rejected:**
- Extending `assetVersion.js` with one key per image — every new asset would
  need a data-file edit. A filter takes the path directly and needs no upkeep.
- Memoizing hashes in a `Map` — the config function runs once per process, not
  per rebuild, so a cached token goes stale under `npm start`. Re-hashing is a
  few ms per build even with the videos, so correctness wins.
- Busting `og:image` / `twitter:image` / JSON-LD `logo` — those are canonical
  identity URLs for crawlers and social scrapers. A stable URL is worth more
  there than a fresh token, so they are deliberately left alone.

**Accepted risks:**
- Query-string busting relies on caches keying on the full URL. True for
  browsers and for the Apache `max-age` rule; a proxy that strips query strings
  would still serve stale. Filename hashing would be immune but would mean
  renaming files that Eleventy only passthrough-copies.

### 2026-08-05 — Reviews: dropped the "Verified" captions, grid → scroll-snap carousel
**What:** Removed all five `<figcaption>` attribution lines from the testimonials
block and replaced the `sm:grid-cols-2` grid with a horizontal carousel:
`.reviews-track` is a native `overflow-x` + `scroll-snap-type: x mandatory`
container; arrows and dots are progressive enhancement in `script.js` and ship
`[hidden]` until JS reveals them. Slide widths are 85% (mobile peek) → 2-up at
`sm` → 3-up at `lg`.

**Why:** The captions asserted "Verified client review" with no source to verify
against once Upwork was stripped from the copy — an unsourced trust claim is
worse than none. The carousel keeps five reviews visible without the page-length
cost of a 5-card grid, and scroll-snap means swipe, trackpad, and arrow keys all
work with `script.js` absent or broken.

**Alternatives rejected:**
- A carousel library (Swiper/Splide) — a CDN dependency and supply-chain surface
  on a site whose only other third-party script is Font Awesome. Native
  scroll-snap needs no runtime at all.
- JS-driven transforms with the track at `overflow: hidden` — that makes the
  reviews *unreachable* if JS fails, which the grid never was.
- Dots authored in `index.html` — the count would silently drift when a review
  is added. `script.js` builds one dot per slide via `createElement`.

**Accepted risks:**
- A persistent `IntersectionObserver` (root = the track) sits alongside the
  one-shot `observeOnce` helper. Deliberate, and commented at the call site:
  dot state must keep updating as the user scrolls, so it cannot unobserve.
- Scrollbar is hidden (`scrollbar-width: none`); the 85% mobile slide width and
  the always-visible arrows carry the scroll affordance instead.

### 2026-08-05 — Claude Code automation layer (hooks, agents, skills, MCP)
**What:** Added `.claude/hooks/` (Node scripts), `.claude/settings.json` (hook wiring),
`.claude/agents/` (link-route-checker, seo-meta-reviewer), `.claude/skills/`
(new-page, preflight-deploy), and `.mcp.json` (playwright, github).
The PostToolUse hook recompiles Tailwind after any template/config edit; the
PreToolUse hook blocks hand-edits to `src/assets/css/styles.css` and `_site/`.

**Why:** Two failure modes here are silent — nothing fails the build. (1) Editing
utility classes without re-running `build:css` ships unstyled markup, because
Tailwind and Eleventy are separate tools. (2) The conversion path is `mailto:` +
an external form, so a typo'd link loses leads with no error anywhere. Deploy is
FTP to HostGator with no atomic swap and no rollback, so checks have to run
*before* a merge to `main`, not after.

**Alternatives rejected:**
- `jq`-based hook commands (the common pattern) — `jq` is not installed here;
  Node is a hard dependency of the toolchain, so hooks are Node scripts.
- Auto-committing the regenerated `styles.css` — the hook rebuilds but never
  commits; staging a generated file behind the author's back hides real diffs.
- Pre-approving the MCP servers via `enabledMcpjsonServers` — trusting an
  external server is the operator's call, so `.mcp.json` declares them and
  Claude Code prompts on first use.

**Accepted risks:**
- The PostToolUse hook adds ~1–2s to template edits (a full Tailwind compile).
- `.mcp.json` servers fetch from the network (`npx`, GitHub HTTP) and are inert
  until explicitly approved.
