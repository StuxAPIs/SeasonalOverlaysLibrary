# Changelog

All notable changes to SeasonalOverlaysLibrary are documented here.
Versioning follows [Semantic Versioning](https://semver.org/).

## [1.4.2] - 2026-09-23

### Fixed
- The footer's version/changelog link still turned accent-purple once visited, even after the earlier fix in v1.2.3 — `a:visited` carries a pseudo-class, giving it higher CSS specificity than the two-element `footer a` selector, so it kept beating it. Every footer across the site (`index.html`, `about.html`, `legal.html`, `changelog.html`, and all six `legal/*.html` pages) now also styles `footer a:visited` explicitly, so the version number and every other footer link stay muted regardless of visited state.

## [1.4.1] - 2026-09-23

### Changed
- Renamed the `nye` preset to `nyeve` (added in v1.4.0, released only minutes earlier — no deprecation needed).

## [1.4.0] - 2026-09-23

### Added
- Three new presets filling the remaining gaps in the default seasonal calendar: `stpatricks` (🍀, St. Patrick's Day, March 17), `thanksgiving` (🦃🥧, US Thanksgiving week, Nov 22&ndash;28 &mdash; a fixed approximation since the real 4th Thursday moves year to year), and `nye` (🎉🥂🍾, New Year's Eve, December 31, distinct from the New Year's Day `fireworks` window).

## [1.3.1] - 2026-09-23

### Fixed
- GitHub Pages was silently failing to auto-deploy after some pushes (no error recorded anywhere) — it used the legacy branch-deploy build system, which relies on an internal push hook with no observability. Switched to GitHub Actions-based Pages deployment (`.github/workflows/pages.yml`), making every deploy an ordinary, visible CI run instead.

## [1.3.0] - 2026-09-23

### Added
- `about.html`, matching the "About" page every other real StuxAPIs product (SecretGen, Kittens) has, linked from the footer.
- `sunny` preset (&#9728;&#65039;&#127774;&#127803;): composable like `halloween`/`christmas`, combining `sun`/`sunFace`/`sunflower` via `include`.

### Changed
- The default seasonal calendar now matches each month's real season wherever `leaves` is used: `leavesSpring` (March, May), `leavesSummer` (July tail, August), `leavesAutumn` (September, most of November), `leavesWinter` (rest of January, rest of February) — instead of always defaulting to autumn regardless of month, or filling gap months with generic `confetti`.
- `leavesWinter`'s content now includes 🌾 and 🪵 alongside 🍂 — there's no dedicated "bare branch" emoji in Unicode, so this is the closest fit for "mostly bare, a few leaves left".
- `snow` is now only used Dec 1&ndash;23; Christmas week (Dec 24&ndash;31) resolves to the `christmas` preset instead.
- August now resolves to the new `sunny` preset instead of `leavesSummer`.
- The first week of November (Nov 1&ndash;7, Bonfire Night) now resolves to `fireworks`; the rest of the month stays `leavesAutumn`.

### Fixed
- The footer didn't match the convention used by real StuxAPIs products: missing the "A StuxAPIs Service" link and the "About" link. Fixed to the same single-line footer those products use.
- The falling particles (`z-index: 9999`) could render on top of the header/footer, obscuring their text/links. Both now sit above the particle layer.

## [1.2.4] - 2026-09-23

### Changed
- Footer copyright year is now computed client-side instead of hardcoded: shows just `2026` (this library's real creation year) until the current year moves past it, then a `2026-<current year>` range. Matches the same fix applied to SecretGen and Kittens.

## [1.2.3] - 2026-09-22

### Fixed
- The footer didn't match the convention used by real StuxAPIs products (SecretGen, Kittens): it was missing the "A StuxAPIs Service" link to `services.stuxapis.net` entirely. Fixed to the same single-line footer those products use: `© YEAR StuxAPIs — Changelog · Boring Legal Stuff · A StuxAPIs Service`, replacing the previous three separate lines (which were also inconsistent with the org's real-product convention).

## [1.2.2] - 2026-09-22

### Changed
- Scrollbars (the page's main vertical one, and the horizontal ones on the code blocks/script-src box) now use a themed purple pill matching the accent colour, instead of the browser's default grey, in both light and dark mode.

## [1.2.1] - 2026-09-22

### Added
- Open Graph and Twitter card meta tags on the demo site (`og:type`,
  `og:site_name`, `og:title`, `og:description`, `og:url`, `og:image` +
  dimensions/alt, and the matching `twitter:*` set), so links shared on
  social media get a proper preview instead of a bare title.

## [1.2.0] - 2026-09-22

### Added
- `random` preset: `preset: 'random'` (or `data-overlay-preset="random"`)
  picks a random built-in preset (never `codebug`, which stays an
  intentional easter egg) and jitters its `count`/`minSize`/`maxSize`/
  `minDuration`/`maxDuration`, occasionally swapping in `randomColors` too
  — a different result most times you trigger it. Anything you pass
  alongside it explicitly (e.g. `count: 100`) is left alone, not jittered.
- Demo site: a "random" button and preset card, placed last in the demo
  grid. Added a fourth badge category, "Special" (its own colour and dot),
  covering `random` and `codebug` — presets that don't fit Single/Multi/
  Calendar since they aren't a fixed look and are never picked by `auto`
  or by `random` itself.

## [1.1.0] - 2026-09-22

### Added
- Composable presets: `leaves` now takes a `seasons` array (`spring`, `summer`,
  `autumn`, `winter`) to pick or combine, with `leavesSpring`/`leavesSummer`/
  `leavesAutumn`/`leavesWinter` as single-season convenience presets. New
  `halloween` and `christmas` presets work the same way via `include`
  (halloween: `pumpkins`/`skulls`/`ghosts`; christmas: `candyCanes`/
  `snowballs`/`snowflakes`/`trees`/`gifts`), each defaulting to a sensible
  combination.
- `randomColors` option: every particle gets its own random hue instead of
  picking from a fixed `colors` array. Works on any shape/colour-based
  preset, including `fireworks`.
- Matching data-attributes for all of the above: `data-overlay-colors`
  (comma-separated), `data-overlay-random-colors`, `data-overlay-seasons`,
  and `data-overlay-include` — no JS required for any of it.
- The demo site now shows a "Single" / "Multi" / "Calendar" badge on every
  preset (dots on the demo buttons, linked badges on the preset cards),
  with a new "Preset types" section explaining what each means.
- The default seasonal calendar now covers every month with no gaps —
  previously several months (March, May, August, September, and parts of
  January/February/July) had no preset configured. Halloween week
  (Oct 25–31) now specifically resolves to `skullsghosts` instead of
  `pumpkins`.

### Fixed
- The "leaves" and "include" option descriptions used bare slashes between
  adjacent `<code>` chips (e.g. `leavesSpring`/`leavesSummer`/...) with no
  space to break on, which could overflow the preset card or table cell
  instead of wrapping. Replaced with comma/"or" separators and added
  `overflow-wrap: break-word` as a general safeguard.

## [1.0.2] - 2026-09-22

### Changed
- The demo site now runs `SeasonalOverlaysLibrary.auto()` in infinite mode on
  load, so it showcases today's calendar preset live rather than waiting for
  a click. The "Infinite mode" checkbox now defaults to checked as well, so
  clicking any demo button afterward keeps running until Stop is pressed.

## [1.0.1] - 2026-09-22

### Added
- A directly linkable, no-download-needed `<script>` URL
  (`https://seasonaloverlayslibrary.stuxapis.net/seasonal-overlays-library.js`)
  now shown on the demo site and used in the README/docs usage snippets,
  instead of implying a local download is required.
- `burstsPerTick` option: how many simultaneous firework burst origins spawn
  per tick (burst behavior only, default 1).
- Two new presets: `skullsghosts` (💀👻, Halloween) and `eastereggs` (🥚🐣🐰, Easter).
- Calendar entries can now be a whole month via `{ month: 4, preset: '...' }`,
  instead of always having to spell out `startMonth`/`startDay`/`endMonth`/`endDay`.
  The default `SeasonalOverlaysLibrary.calendar` now uses this shorthand for
  Pride month, Halloween, Autumn, and Christmas, and adds Easter (all of April)
  mapped to `eastereggs`.

### Fixed
- The `snowflakes` preset's ❅/❆ glyphs (U+2745/U+2746) aren't reliably
  supported by common fonts and could render as tofu/garbled boxes depending
  on the host's font stack. Replaced with ❄/✳/✴ (U+2744/U+2733/U+2734), which
  are broadly supported.

### Changed
- The `fireworks` preset is noticeably bigger and busier: 48 particles per
  burst (was 32), 3 simultaneous burst origins per tick, and ticks every
  450ms instead of 900ms.

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
