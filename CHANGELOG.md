# Changelog

All notable changes to SeasonalOverlaysLibrary are documented here.
Versioning follows [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-09-22

### Added
- Initial release of `seasonal-overlays-library.js`: a dependency-free
  library for brief, full-viewport particle overlays, recreating the
  click-triggered animation technique from Butlin's homepage (a batch of
  particles, each with its own randomly-generated CSS `@keyframes`
  animation and a negative `animation-delay` so the batch looks continuous)
  and generalizing it into a small reusable library.
- Three particle behaviors: `fall` (drifts top-to-bottom), `burst` (radial
  explosion, repeats — used by fireworks), and `fly` (crosses the screen,
  optionally trailing particles — used by nyancat).
- Nine built-in presets: `snow`, `snowflakes`, `leaves`, `confetti`,
  `fireworks`, `pumpkins`, `hearts`, `rainbows`, `nyancat`. All render with
  plain CSS shapes or emoji — no external image assets required.
- `codebug`: an easter-egg preset. During development, one of the snowflake
  glyphs was served without a charset header and got decoded as Latin-1 by
  the browser, producing garbled mojibake text. Kept as a preset, verbatim,
  by request.
- Automatic wiring via `data-overlay`/`data-overlay-preset` (plus
  `data-overlay-count`, `data-overlay-duration-ms`, `data-overlay-infinite`)
  on any clickable element — no JS required — alongside a manual
  `SeasonalOverlaysLibrary.start()`/`.stop()` API. Both work at once.
- A configurable seasonal calendar (`SeasonalOverlaysLibrary.calendar`) and
  `preset: 'auto'` / `SeasonalOverlaysLibrary.auto()`, which resolves
  today's date to a preset and starts it.
- Support for fully custom particles via `imageUrl`/`icons` (images),
  `content` (text/emoji glyphs), or `colors`/`shape` (plain CSS shapes),
  which can also be layered onto a built-in preset's motion to reskin it.
- One-shot bursts by default (`durationMs`, default 2200ms), or infinite
  mode (`durationMs: null` / `data-overlay-infinite`) until stopped.
- Demo/docs site (`index.html`) showcasing every preset live, with usage
  snippets for both wiring methods.
- Standard repo scaffolding: legal hub at `/legal` ("Boring Legal Stuff"),
  self-hosted Fredoka font, dynamic `changelog.html`, `404.html`,
  `dev-server.sh`/`.bat`, `commit.sh`/`.bat`.
