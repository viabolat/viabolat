// Cache-busting tokens for static assets.
// .htaccess caches /assets/css|js for 30 days (max-age=2592000) under stable
// filenames, so without a version query a redeploy leaves returning visitors on
// stale CSS/JS while the no-cache HTML updates — the site renders broken.
// We hash each asset's content; the token changes ONLY when the file changes,
// giving true cache-busting with clean diffs. build:css runs before eleventy in
// `npm run build`, so styles.css is already freshly minified when hashed here.
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

function hashFile(relPath) {
  try {
    const buf = fs.readFileSync(path.join(__dirname, "..", relPath));
    return crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
  } catch (err) {
    // Fail open: a missing/unreadable asset shouldn't break the build.
    return "0";
  }
}

module.exports = () => ({
  css: hashFile("assets/css/styles.css"),
  js: hashFile("assets/js/script.js"),
});
