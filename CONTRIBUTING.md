<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg">
    <img src="assets/logo.svg" height="80" alt="SeasonalOverlaysLibrary">
  </picture>
</p>

# Contributing to SeasonalOverlaysLibrary

The library itself is a single file, [`seasonal-overlays-library.js`](seasonal-overlays-library.js),
with no dependencies and no build step. This document is for anyone working
on the library or its demo site.

## Local setup

There's no build step or dependencies — just clone the repo and run
`./dev-server.sh [port]` (or `dev-server.bat [port]` on Windows), which starts
a local static server pointed at the directory. Then open
`http://127.0.0.1:8000`.

## Project conventions

- `seasonal-overlays-library.js` is the whole library — one self-contained
  IIFE, no build step, no minification pipeline. Keep it that way.
- `index.html` is the live demo/docs site, and loads the library the same
  way a consumer would (a plain `<script src="seasonal-overlays-library.js">`).
- Static HTML pages (`index.html`, `legal.html` + `legal/`, `changelog.html`, `404.html`) — no framework, no backend.
- Keep it lightweight and dependency-free; the Fredoka font is self-hosted under `assets/fonts/` (matching other StuxAPIs products like Kittens), not pulled from a third-party CDN.
- `changelog.html` fetches and renders `CHANGELOG.md` at runtime — don't hand-duplicate changelog content into it.
- General contact uses `hello@stuxapis.net`; legal-page contact uses `legal@stuxapis.net`.
- New particle presets go in the `PRESETS` object in the library file, and should be documented in both the header comment block and the demo page.
- Match the existing code style: no comments explaining *what* the code does, only *why* when something is genuinely non-obvious.

## Branches

- Work on `test`, or on a branch off it. Never push to `main`
- Changes reach `main` only through a pull request from `test` into `main`, which needs CI to pass and is reviewed and merged by Leo
- Release commits and tags are made on `test` (`git push origin test --tags`) and take effect when the pull request is merged. Merging deploys the site to GitHub Pages.

## Versioning

This project uses [Date Versioning](https://datevers.ing). To release:

1. Add a `## vYY.MM.DD` entry at the top of `CHANGELOG.md`, with its sections in this order: Added, Changed, Fixed, Removed, Security, Deprecated.
2. Set `VERSION.md` to the same bare version (no `v`): today's **UTC** date as `YY.MM.DD`, or `YY.MM.DD-1`, `-2`… for later releases the same UTC day. Never a future date. Use UTC, not local time: just after midnight in the UK it is still the previous day in UTC.
3. Run `bash tests/version.sh` and `node tests/pages.js`.
4. Run `./commit.sh` (or `commit.bat` on Windows). It checks the version, commits and tags `vYY.MM.DD`, and never pushes.

## Before committing

- Open `index.html` in a browser and click through every preset in the demo
- Check the page at common viewport widths (mobile/tablet/desktop) since it's meant to be responsive
- If you touched the library file, check the browser console for errors while triggering each behavior (`fall`, `burst`, `fly`)
