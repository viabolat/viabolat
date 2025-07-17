#!/usr/bin/env bash
set -eu

# Get the current directory
REPO_DIR="$(pwd)"

echo "Cleaning repo: $REPO_DIR"

# Find files NOT matching the extensions and delete them
find "$REPO_DIR" -type f ! \( \
    -iname '*.yml' -o \
    -iname '*.json' -o \
    -iname '*.tf' -o \
    -iname '*.hcl' -o \
    -iname '*.tfvars' -o \
    -iname '*.txt' -o \
    -iname '*.sh' \
\) -exec rm -f {} +

# Optional: Delete empty directories after cleaning
# find "$REPO_DIR" -type d -empty -delete

echo "Finished cleaning: $REPO_DIR"
