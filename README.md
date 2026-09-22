<p align="center">
  <img src="https://global.media.stuxapis.net/logo.png" height="100" alt="StuxAPIs Logo">
</p>

# SeasonalOverlaysLibrary

A small, dependency-free JavaScript library for brief full-viewport particle
overlays — snow, snowflakes, falling leaves, confetti, fireworks, hearts,
pumpkins, Pride-month rainbows, a flying cat with a rainbow trail, and your
own custom icons — triggered by a click, or automatically from a seasonal
calendar.

**Live demo & docs:** [seasonaloverlayslibrary.stuxapis.net](https://seasonaloverlayslibrary.stuxapis.net)

## Why

Butlin's homepage plays a brief particle animation when you click their
seasonal tiles (pumpkins for Halloween, snow for Christmas). This library is
an original recreation of that technique — a batch of particles, each with
its own randomly-generated CSS `@keyframes` animation and a negative
`animation-delay` so the whole batch looks continuous instead of
synchronized — generalized into a small, reusable, MIT-licensed library with
a handful of extra behaviors and built-in presets on top.

## Features

- 📦 Zero dependencies, single `<script>` tag, no build step
- 🎨 9 built-in presets: `snow`, `snowflakes`, `leaves`, `confetti`,
  `fireworks`, `pumpkins`, `hearts`, `rainbows`, `nyancat` (plus a
  `codebug` easter egg — see the changelog)
- 🖱️ Automatic wiring via `data-overlay`/`data-overlay-preset` attributes —
  tag any element, no JS required — or drive it manually from your own code;
  both work at once
- 📅 A configurable seasonal calendar — `preset: 'auto'` resolves today's
  date to a preset for you, or replace the calendar with your own
- ♾️ One-shot bursts by default, or infinite mode until stopped
- 🖼️ Renders with plain CSS shapes or emoji out of the box — no image assets
  required — or supply your own `imageUrl`/`icons` to reskin any preset

## Quick start

```html
<button data-overlay-preset="fireworks">Celebrate</button>
<button data-overlay-preset="snow" data-overlay-infinite>Let it snow</button>
<button data-overlay-preset="auto">Surprise me (today's calendar preset)</button>

<script src="https://seasonaloverlayslibrary.stuxapis.net/seasonal-overlays-library.js"></script>
```

Or drive it from your own JavaScript:

```js
SeasonalOverlaysLibrary.start({ preset: 'leaves' });
SeasonalOverlaysLibrary.start({ preset: 'snow', durationMs: null }); // infinite
SeasonalOverlaysLibrary.start({ imageUrl: '/assets/pumpkin.png' });  // fully custom
SeasonalOverlaysLibrary.auto();                                     // today's calendar preset
SeasonalOverlaysLibrary.stop();                                     // stop an infinite run
```

Full option reference, every preset, and a live interactive demo of each one
are on the [demo/docs site](https://seasonaloverlayslibrary.stuxapis.net) —
the same information also lives as comments at the top of
[`seasonal-overlays-library.js`](seasonal-overlays-library.js).

## A note on "nyancat"

The actual Nyan Cat sprite/GIF is a specific copyrighted character, not
something this library bundles. The `nyancat` preset gives you the
*mechanic* — a sprite flying across the screen trailing a rainbow —
defaulting to a 🐱 emoji. Pass your own licensed art via `imageUrl` if you
have one.

## Local development

No build step or dependencies. Clone the repo and run `./dev-server.sh
[port]` (or `dev-server.bat [port]` on Windows), then open
`http://127.0.0.1:8000`.

## License

MIT — see [LICENSE](LICENSE).

## Copyright

(C) 2026 Stux Group Ltd. All rights reserved.

---

*Built & Maintained by <img src="https://global.media.stuxapis.net/icon.png" height="14" alt="StuxAPIs" valign="middle"> [StuxAPIs](https://github.com/StuxAPIs), Hosted by <img src="https://github.com/Stuxedo.png" height="14" alt="Stuxedo" valign="middle"> [Stuxedo](https://stuxedo.com).
StuxAPIs is a part of the <img src="https://global.media.stux.group/icon.png" height="14" alt="Stux.Group" valign="middle"> Stux.Group brand of businesses.*
