const fs = require("fs");
const crypto = require("crypto");
const path = require("path");

module.exports = function (eleventyConfig) {
  // `| bust` — content-hash cache-buster for passthrough assets.
  // .htaccess caches everything under /assets for 30 days (max-age=2592000)
  // against stable filenames, so swapping a logo or video in place leaves
  // returning visitors on the old file while the no-cache HTML updates.
  // Hashing content means the token changes only when the file actually does.
  // CSS/JS are handled by src/_data/assetVersion.js; this covers the rest.
  // reason: deliberately not memoized — a cached token would go stale in
  // `npm start`, since this config function runs once per process and not per
  // rebuild. Re-hashing costs a few ms per build even with the 3.6MB videos.
  eleventyConfig.addFilter("bust", (assetPath) => {
    if (typeof assetPath !== "string" || !assetPath.startsWith("/assets/")) {
      return assetPath;
    }
    try {
      const buf = fs.readFileSync(path.join(__dirname, "src", assetPath));
      const token = crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
      return `${assetPath}?v=${token}`;
    } catch (err) {
      // Fail open: a missing or unreadable asset shouldn't break the build.
      return assetPath;
    }
  });


  // Passthrough copy for static assets
  // This copies files/folders from the input directory to the output directory
  // We need to tell Eleventy to watch our compiled CSS file for changes.
  eleventyConfig.addWatchTarget("./src/assets/css/styles.css");

  eleventyConfig.addPassthroughCopy("src/assets"); // This will now copy the logo as well
  // Create a favicon.ico for better browser compatibility
  eleventyConfig.addPassthroughCopy({
    "src/assets/images/logo.svg": "favicon.ico",
  });
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Return the configuration object
  return {
    dir: {
      input: "src",
      output: "_site",
    },
    // Set Nunjucks as the default template engine for HTML
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
  };
};
