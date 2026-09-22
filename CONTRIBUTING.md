<p align="center">
  <img src="https://global.media.stuxapis.net/logo.png" height="80" alt="StuxAPIs Logo">
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

## Versioning and changelog

- The version lives in `VERSION.md` (a bare version string) — bump it on every release, following [Semantic Versioning](https://semver.org/)
- Every release gets a `CHANGELOG.md` entry using `### Added` / `### Changed` / `### Fixed` subsections
- `commit.sh` (bash) and `commit.bat` (Windows) read `VERSION.md` to commit and tag a release — no need to edit them per release

## Before committing

- Open `index.html` in a browser and click through every preset in the demo
- Check the page at common viewport widths (mobile/tablet/desktop) since it's meant to be responsive
- If you touched the library file, check the browser console for errors while triggering each behavior (`fall`, `burst`, `fly`)
