---
name: preflight-deploy
description: Pre-merge check for viabolat before staging lands on main. Verifies the build, that the committed styles.css is current, that the .htaccess copy step survives, and that the conversion paths still work in the built output.
model: claude-sonnet-5
disable-model-invocation: true
allowed-tools: Read, Glob, Grep, Bash, Agent
---

# Preflight Deploy

A push to `main` FTP-deploys `_site/` straight to HostGator. **FTP overwrites file
by file — there is no atomic swap and no rollback.** A bad merge is live until a
corrected build finishes uploading. This skill runs the checks that matter before
that becomes irreversible.

You do **not** merge, push, or deploy. You report GO / NO-GO and stop.

## Checks

Run in order. Report each as PASS / FAIL with the evidence, and keep going after a
failure so the user sees the full picture in one pass.

1. **Clean build**

```bash
npm run build
```

   Any non-zero exit is an immediate NO-GO. Quote the error.

2. **Committed `styles.css` is current.** The compiled sheet lives *inside* `src/`
   and is committed. If the build just changed it, the working tree is dirty and
   the change is uncommitted — meaning `main` would deploy CSS that doesn't match
   the templates.

```bash
git status --porcelain src/assets/css/styles.css
```

   Non-empty output = FAIL. Tell the user to commit it; do not commit it yourself.

3. **Cache-busting tokens moved when they should have.** `src/_data/assetVersion.js`
   MD5s `styles.css` and `script.js`. Confirm the `?v=` query in `_site/index.html`
   matches a fresh hash of the deployed asset:

```bash
node -e 'const c=require("crypto"),f=require("fs");for(const [k,p] of [["css","_site/assets/css/styles.css"],["js","_site/assets/js/script.js"]])console.log(k,c.createHash("md5").update(f.readFileSync(p)).digest("hex").slice(0,8))'
grep -o 'assets/\(css/styles.css\|js/script.js\)?v=[a-f0-9]*' _site/index.html | sort -u
```

   Mismatch = FAIL: returning visitors get 30-day-cached stale assets against
   no-cache HTML, which renders the site broken.

4. **`.htaccess` copy step still exists.** Eleventy does not copy it — it is a
   manual line in the workflow. Losing it silently kills clean URLs, HTTPS
   enforcement, cache headers, and the 404 mapping all at once.

```bash
grep -n 'htaccess' .github/workflows/deployment.yml
```

   No match = FAIL. Also confirm `.htaccess` exists at the repo root.

5. **Conversion paths survive the build.** Grep the *built* output, not the source:

```bash
grep -roh 'mailto:[^"]*' _site/ | sort -u
grep -roh 'href="https://[^"]*form[^"]*"' _site/ | sort -u
```

   Report every distinct address and form URL. More than one mailto address, or a
   changed form URL, is a FAIL pending human confirmation — this is the whole lead
   funnel and nothing downstream will catch a typo.

6. **Sitemap and robots agree.** Confirm `_site/sitemap.xml` lists every public page
   and omits every `noindex: true` page (404 must be absent).

7. **Delegate the deep audits.** Launch `link-route-checker` and `seo-meta-reviewer`
   against the built output and fold their blocking findings into the verdict.

8. **Show what's actually shipping.**

```bash
git log --oneline main..HEAD
git diff --stat main...HEAD
```

## Verdict

End with one line: `GO` or `NO-GO`, followed by the blocking items as a short list.
No summary of the checks that passed beyond their PASS markers.
