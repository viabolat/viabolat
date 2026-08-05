#!/usr/bin/env node
// PostToolUse hook: recompile Tailwind after a template or Tailwind-config edit.
//
// reason: Tailwind and Eleventy are separate build steps that don't know about
// each other (see CLAUDE.md "Build pipeline"). Editing utility classes in a
// template without re-running build:css leaves those classes with no CSS in
// src/assets/css/styles.css, and the page silently renders unstyled. This hook
// closes that gap so the committed styles.css always matches the templates.
//
// Side effect that matters: src/_data/assetVersion.js hashes styles.css on disk,
// so keeping it current also keeps the cache-busting token honest.
//
// Written in Node (not jq) because jq is not installed in this environment,
// while Node is a hard dependency of the Eleventy/Tailwind toolchain.

const { execFileSync } = require("child_process");
const path = require("path");

const PROJECT_DIR = path.resolve(__dirname, "..", "..");

// Any of these can change which Tailwind utilities end up in the compiled sheet.
const TRIGGERS = [
  /^src[\\/].*\.(html|njk)$/i,
  /^src[\\/]assets[\\/]css[\\/]input\.css$/i,
  /^tailwind\.config\.js$/i,
];

function readStdin() {
  try {
    return require("fs").readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function main() {
  let payload;
  try {
    payload = JSON.parse(readStdin() || "{}");
  } catch {
    return; // Malformed payload is not this hook's problem — stay out of the way.
  }

  const input = payload.tool_input || {};
  const raw =
    (payload.tool_response && payload.tool_response.filePath) ||
    input.file_path ||
    input.notebook_path ||
    "";
  if (!raw) return;

  const rel = path.relative(PROJECT_DIR, path.resolve(PROJECT_DIR, raw));
  // Edits outside the project (rel starts with "..") are never build inputs.
  if (rel.startsWith("..")) return;
  if (!TRIGGERS.some((re) => re.test(rel))) return;

  try {
    execFileSync("npm", ["run", "build:css"], {
      cwd: PROJECT_DIR,
      stdio: "ignore",
      timeout: 90_000,
    });
    process.stdout.write(
      JSON.stringify({
        suppressOutput: true,
        systemMessage: "Tailwind recompiled (styles.css is in sync).",
      })
    );
  } catch (err) {
    // Fail loud but non-blocking: the edit already succeeded, and a failed CSS
    // build is a real problem the model should know about, not silently swallow.
    process.stderr.write(
      `build:css failed after editing ${rel}: ${err.message}\n` +
        "styles.css is now STALE — run `npm run build:css` before committing.\n"
    );
  }
}

main();
