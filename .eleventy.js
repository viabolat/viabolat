module.exports = function (eleventyConfig) {
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
