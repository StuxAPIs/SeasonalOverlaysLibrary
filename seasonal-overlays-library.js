/**
 * SeasonalOverlaysLibrary — brief, full-viewport particle overlays (snow,
 * snowflakes, falling leaves, confetti, fireworks, hearts, pumpkins,
 * pride-month rainbows, a flying cat with a rainbow trail, or your own
 * custom icon), triggered by a click — or automatically, based on today's
 * date via a configurable seasonal calendar.
 *
 * Same technique as the Butlins.com Spooktober/Christmas homepage tiles: each
 * particle is a fixed-position div with its own randomly-generated CSS
 * @keyframes animation (a negative animation-delay desyncs particles so they
 * don't all move in lockstep) and the whole batch is torn down after a short
 * duration (unless run in infinite mode).
 *
 * No dependencies, no external assets required — the built-in presets render
 * with plain CSS shapes/emoji, not images, so they work out of the box.
 *
 * A note on "nyancat": the actual Nyan Cat sprite/GIF is a specific
 * copyrighted character, not something this library bundles. The
 * `nyancat` preset gives you the *mechanic* — a sprite flying across the
 * screen trailing a rainbow — defaulting to a 🐱 emoji. Pass your own
 * licensed art via `imageUrl` if you have one.
 *
 * ── Two ways to wire it up, and both work at once ──────────────────────────
 *
 * 1) Automatic, via data-attributes — tag ANY clickable element (an <img>,
 *    a <button>, a <div>, whatever) and it triggers on click with zero JS.
 *    Click delegation means it also picks up elements added to the page
 *    later (e.g. by a framework), no re-init needed.
 *
 *      <button data-overlay-preset="fireworks">Celebrate</button>
 *      <button data-overlay-preset="snow" data-overlay-infinite>Let it snow</button>
 *      <button data-overlay-preset="auto">Surprise me</button>
 *      <img src="/assets/spooktober-tile.png" data-overlay="/assets/pumpkin.png" alt="Spooktober">
 *
 *      <script src="seasonal-overlays-library.js"></script>
 *
 *    Optional per-element overrides (read from that element's dataset):
 *      data-overlay-preset      - a preset name below, or 'auto' to resolve
 *                                  today's date against the seasonal calendar
 *      data-overlay             - a custom image URL (works alone, or layered onto a preset
 *                                  to reskin its motion with your own art)
 *      data-overlay-count       - how many particles (preset has its own default)
 *      data-overlay-duration-ms - how long the effect runs, ms (default 2200)
 *      data-overlay-infinite    - presence alone means "run forever" (until
 *                                  SeasonalOverlaysLibrary.stop() is called, or the
 *                                  trigger is clicked again). Overrides duration-ms.
 *
 * 2) Manual, from your own JS — call it directly, e.g. from a click handler
 *    you already have, a timer, on page load, etc:
 *
 *      SeasonalOverlaysLibrary.start({ preset: 'leaves' });
 *      SeasonalOverlaysLibrary.start({ preset: 'snow', durationMs: null }); // infinite
 *      SeasonalOverlaysLibrary.start({ imageUrl: '/assets/pumpkin.png' });  // fully custom, no preset
 *      SeasonalOverlaysLibrary.auto();                                     // today's calendar preset, right now
 *      SeasonalOverlaysLibrary.stop();                                     // stop an infinite run
 *
 * ── Presets ──────────────────────────────────────────────────────────────
 *   snow        - small white circles, drifting straight down, no rotation
 *   snowflakes  - ❄ glyphs, slow fall with gentle rotation
 *   leaves      - 🍁🍂🍃 glyphs, wide drift and tumbling rotation
 *   confetti    - small coloured squares, fast fall, heavy rotation
 *   fireworks   - repeating radial bursts of coloured sparks (an explode-and-fade,
 *                 not a fall)
 *   pumpkins    - 🎃 glyphs, gentle fall (Halloween)
 *   hearts      - heart emoji, gentle fall (Valentine's)
 *   rainbows    - squares in the six classic Pride-flag colours, fast fall
 *                 (Pride month)
 *   nyancat     - a sprite (🐱 by default) flying across the screen trailing
 *                 a rainbow — see the copyright note above
 *   codebug     - easter egg: the actual mojibake text produced during this
 *                 library's development by a missing charset header, plus a
 *                 few classic bug values, falling in red monospace
 *

 * ── Seasonal calendar / auto mode ───────────────────────────────────────
 * `SeasonalOverlaysLibrary.calendar` is a plain array of date ranges mapped
 * to a preset name, checked in order, first match wins:
 *
 *   [{ startMonth: 6, startDay: 1, endMonth: 6, endDay: 30, preset: 'rainbows' }, ...]
 *
 * Replace or edit this array to define your own site's seasonal theme.
 * `SeasonalOverlaysLibrary.auto(options)` resolves today's date against it and
 * starts that preset immediately (options are merged in, same as start()).
 * `data-overlay-preset="auto"` does the same thing, resolved at click time.
 * If nothing in the calendar matches today, it's a no-op (nothing plays).
 *
 * ── Full start() options ────────────────────────────────────────────────
 *   preset       - name of a built-in preset above, or 'auto' (optional)
 *   imageUrl     - single custom icon image URL (shorthand for icons: [imageUrl])
 *   icons        - array of image URLs; each particle picks one at random
 *   content      - array of text glyphs (e.g. emoji); each particle picks one at random
 *   colors       - array of CSS colors for plain-shape particles (and as the
 *                  text colour for non-emoji glyphs, e.g. ❄)
 *   shape        - 'circle' | 'square' (used when no icons/content given)
 *   behavior     - 'fall' (top-to-bottom drift, default) | 'burst' (radial
 *                  explosion, repeats) | 'fly' (flies across the screen,
 *                  optionally trailing particles)
 *   count        - particles per fall batch, per firework burst, or flying sprites
 *   minSize/maxSize - particle size in px
 *   minDuration/maxDuration - seconds per particle (fall/fly), or per burst (burst)
 *   drift        - max horizontal drift in vw over the fall (fall behavior only)
 *   rotate       - whether particles spin as they fall (fall behavior only)
 *   burstIntervalMs - gap between fireworks bursts (burst behavior only, default 900ms)
 *   trail        - whether a fly particle leaves a fading trail (fly behavior only)
 *   trailColors  - CSS colors cycled through for the trail (fly behavior only)
 *   zIndex       - stacking order (default 9999)
 *   durationMs   - how long the whole effect runs before auto-cleanup (default 2200ms).
 *                  Pass null (or use data-overlay-infinite) to run until
 *                  SeasonalOverlaysLibrary.stop() is called.
 */
(function (window, document) {
  'use strict';

  const STYLE_ID = 'seasonal-overlays-style';
  let container = null;
  let styleEl = null;
  let stopTimer = null;
  let burstInterval = null;
  let flyTrailTimers = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function injectRule(cssText) {
    styleEl.sheet.insertRule(cssText, styleEl.sheet.cssRules.length);
  }

  // Fills in a particle's visual appearance: a custom image, a text glyph
  // (emoji etc), or a plain coloured shape — whichever the options provide.
  // Text glyphs get an explicit colour too: full-colour emoji ignore it, but
  // monochrome symbol glyphs (e.g. ❄) would otherwise inherit the page's
  // default text colour and can end up invisible against a dark background.
  function applyVisual(el, opts, size) {
    if (opts.icons && opts.icons.length) {
      el.style.backgroundImage = 'url("' + pick(opts.icons) + '")';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
    } else if (opts.content && opts.content.length) {
      el.textContent = pick(opts.content);
      el.style.fontSize = size + 'px';
      el.style.lineHeight = '1';
      el.style.textAlign = 'center';
      el.style.color = opts.colors && opts.colors.length ? pick(opts.colors) : '#ffffff';
      if (opts.fontFamily) el.style.fontFamily = opts.fontFamily;
    } else {
      el.style.backgroundColor = opts.colors && opts.colors.length ? pick(opts.colors) : '#ffffff';
      el.style.borderRadius = opts.shape === 'square' ? '2px' : '50%';
    }
  }

  // "fall" behavior: particles drift from above the viewport to below it,
  // each on its own randomly-generated keyframes with a negative delay so
  // the whole batch looks continuous instead of synchronized.
  function createFallParticle(opts) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const startX = rand(0, 100);
    const endX = startX + rand(-opts.drift, opts.drift);
    const scale = rand(0.7, 1.15);
    const duration = rand(opts.minDuration, opts.maxDuration);
    const delay = -rand(0, duration);
    const rot = opts.rotate ? rand(180, 720) * (Math.random() < 0.5 ? -1 : 1) : 0;
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(' + startX + 'vw, -10vh) scale(' + scale + ') rotate(0deg); }' +
      '100% { transform: translate(' + endX + 'vw, 110vh) scale(' + scale + ') rotate(' + rot + 'deg); }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: size + 'px',
      height: size + 'px',
      opacity: String(rand(0.5, 1)),
      pointerEvents: 'none',
      willChange: 'transform',
      animation: name + ' ' + duration + 's linear ' + delay + 's infinite'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');
    return el;
  }

  // "burst" behavior: particles explode outward from a point and fade —
  // used for fireworks. Each particle removes itself when its (finite)
  // animation ends, since bursts repeat and would otherwise accumulate in
  // the DOM during a long or infinite show.
  function createBurstParticle(opts, originX, originY) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const angle = rand(0, Math.PI * 2);
    const distance = rand(opts.minDistance, opts.maxDistance);
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + opts.gravity;
    const duration = rand(opts.minDuration, opts.maxDuration);
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(-50%, -50%) translate(0px, 0px) scale(1); opacity: 1; }' +
      '75% { opacity: 1; }' +
      '100% { transform: translate(-50%, -50%) translate(' + dx + 'px, ' + dy + 'px) scale(0.3); opacity: 0; }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: originY + 'px',
      left: originX + 'px',
      width: size + 'px',
      height: size + 'px',
      pointerEvents: 'none',
      willChange: 'transform, opacity',
      animation: name + ' ' + duration + 's ease-out forwards'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');
    el.addEventListener('animationend', function () { el.remove(); });
    return el;
  }

  function spawnFireworkBurst(opts) {
    if (!container) return;
    const originX = rand(window.innerWidth * 0.15, window.innerWidth * 0.85);
    const originY = rand(window.innerHeight * 0.15, window.innerHeight * 0.55);
    for (let i = 0; i < opts.count; i++) {
      container.appendChild(createBurstParticle(opts, originX, originY));
    }
  }

  // A single trail dot, used by "fly" behavior: fades and shrinks in place.
  function spawnTrailDot(opts, x, y) {
    if (!container) return;
    const dot = document.createElement('div');
    const size = rand(8, 16);
    const color = opts.trailColors && opts.trailColors.length ? pick(opts.trailColors) : '#ffffff';
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }' +
      '100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }' +
      '}'
    );

    Object.assign(dot.style, {
      position: 'fixed',
      top: y + 'px',
      left: x + 'px',
      width: size + 'px',
      height: size + 'px',
      background: color,
      borderRadius: '2px',
      pointerEvents: 'none',
      zIndex: '1',
      animation: name + ' 0.6s ease-out forwards'
    });
    dot.setAttribute('aria-hidden', 'true');
    container.appendChild(dot);
    dot.addEventListener('animationend', function () { dot.remove(); });
  }

  // "fly" behavior: a sprite flies straight across the viewport (either
  // direction, chosen at random) at a random height, optionally dropping a
  // fading trail behind it as it goes.
  function createFlyParticle(opts) {
    const el = document.createElement('div');
    const size = rand(opts.minSize, opts.maxSize);
    const y = rand(10, 80);
    const duration = rand(opts.minDuration, opts.maxDuration);
    const delay = -rand(0, duration);
    const reverse = Math.random() < 0.5;
    const fromX = reverse ? 110 : -10;
    const toX = reverse ? -10 : 110;
    const flip = reverse ? -1 : 1;
    const name = 'sol-' + Math.random().toString(36).slice(2, 9);

    injectRule(
      '@keyframes ' + name + ' {' +
      '0% { transform: translate(' + fromX + 'vw, ' + y + 'vh) scaleX(' + flip + '); }' +
      '100% { transform: translate(' + toX + 'vw, ' + y + 'vh) scaleX(' + flip + '); }' +
      '}'
    );

    Object.assign(el.style, {
      position: 'fixed',
      top: '0px',
      left: '0px',
      width: size + 'px',
      height: size + 'px',
      pointerEvents: 'none',
      willChange: 'transform',
      zIndex: '2',
      animation: name + ' ' + duration + 's linear ' + delay + 's infinite'
    });
    applyVisual(el, opts, size);
    el.setAttribute('aria-hidden', 'true');

    if (opts.trail) {
      const timer = window.setInterval(function () {
        if (!el.isConnected) { clearInterval(timer); return; }
        const rect = el.getBoundingClientRect();
        spawnTrailDot(opts, rect.left + rect.width / 2, rect.top + rect.height / 2);
      }, 60);
      flyTrailTimers.push(timer);
    }

    return el;
  }

  const PRESETS = {
    snow: {
      behavior: 'fall',
      colors: ['#ffffff'],
      shape: 'circle',
      count: 60,
      minSize: 6, maxSize: 14,
      minDuration: 8, maxDuration: 16,
      drift: 8,
      rotate: false
    },
    snowflakes: {
      behavior: 'fall',
      content: ['❄', '✳', '✴'], // snowflake / asterisk glyphs, widely supported, unlike U+2745/2746
      colors: ['#ffffff'],
      count: 40,
      minSize: 14, maxSize: 26,
      minDuration: 7, maxDuration: 14,
      drift: 10,
      rotate: true
    },
    leaves: {
      behavior: 'fall',
      content: ['🍁', '🍂', '🍃'], // 🍁 🍂 🍃
      count: 35,
      minSize: 20, maxSize: 34,
      minDuration: 6, maxDuration: 12,
      drift: 22,
      rotate: true
    },
    confetti: {
      behavior: 'fall',
      colors: ['#ff4d4f', '#ffd400', '#36c5f0', '#2ecc71', '#a349ff', '#ff8a00'],
      shape: 'square',
      count: 80,
      minSize: 8, maxSize: 14,
      minDuration: 4, maxDuration: 8,
      drift: 15,
      rotate: true
    },
    fireworks: {
      behavior: 'burst',
      colors: ['#ff4d4f', '#ffd400', '#36c5f0', '#2ecc71', '#ff8a00', '#ff4dd2'],
      shape: 'circle',
      count: 32,
      minSize: 4, maxSize: 8,
      minDuration: 1, maxDuration: 1.6,
      minDistance: 80, maxDistance: 240,
      gravity: 60,
      burstIntervalMs: 900
    },
    pumpkins: {
      behavior: 'fall',
      content: ['🎃'], // 🎃
      count: 40,
      minSize: 24, maxSize: 40,
      minDuration: 6, maxDuration: 11,
      drift: 12,
      rotate: false
    },
    hearts: {
      behavior: 'fall',
      content: ['❤️', '💕', '💖'], // ❤️ 💕 💖
      count: 30,
      minSize: 22, maxSize: 36,
      minDuration: 6, maxDuration: 11,
      drift: 14,
      rotate: false
    },
    rainbows: {
      // Classic six-stripe Pride flag palette.
      behavior: 'fall',
      colors: ['#e40303', '#ff8c00', '#ffed00', '#008026', '#004dff', '#750787'],
      shape: 'square',
      count: 60,
      minSize: 10, maxSize: 18,
      minDuration: 5, maxDuration: 10,
      drift: 18,
      rotate: true
    },
    nyancat: {
      // See the copyright note in the file header — this is the flying +
      // rainbow-trail mechanic, defaulting to a plain cat emoji. Pass your
      // own `imageUrl` for real Nyan Cat art you have the rights to use.
      behavior: 'fly',
      content: ['🐱'], // 🐱
      count: 1,
      minSize: 56, maxSize: 56,
      minDuration: 4, maxDuration: 4,
      trail: true,
      trailColors: ['#ff0018', '#ffa52c', '#ffff41', '#008018', '#0000f9', '#86007d']
    },
    codebug: {
      // An easter egg: this is the actual mojibake that showed up during
      // development when a UTF-8 snowflake glyph got served without a
      // charset header and was decoded as Latin-1 by the browser, plus a
      // couple of classic bug values for good measure. Deliberately
      // hardcoded, not a real encoding bug — kept as a preset by request.
      behavior: 'fall',
      content: ['âœ\u0083', 'âœ', 'NaN', 'undefined', '�', '0x00', 'SEGFAULT'],
      colors: ['#ff4d4f', '#ff8a8a'],
      fontFamily: 'monospace',
      count: 35,
      minSize: 13, maxSize: 20,
      minDuration: 6, maxDuration: 12,
      drift: 10,
      rotate: false
    }
  };

  // A "classic" seasonal calendar. First matching range wins. Replace this
  // array (or edit it in place) to define your own site's seasonal theme —
  // see the header comment for the shape of each entry.
  const SEASONAL_CALENDAR = [
    { startMonth: 1, startDay: 1, endMonth: 1, endDay: 2, preset: 'fireworks' },   // New Year
    { startMonth: 2, startDay: 1, endMonth: 2, endDay: 14, preset: 'hearts' },     // Valentine's season
    { startMonth: 6, startDay: 1, endMonth: 6, endDay: 30, preset: 'rainbows' },   // Pride month
    { startMonth: 7, startDay: 1, endMonth: 7, endDay: 5, preset: 'fireworks' },   // Independence Day window
    { startMonth: 10, startDay: 1, endMonth: 10, endDay: 31, preset: 'pumpkins' }, // Halloween / Spooktober
    { startMonth: 11, startDay: 1, endMonth: 11, endDay: 30, preset: 'leaves' },   // Autumn
    { startMonth: 12, startDay: 1, endMonth: 12, endDay: 31, preset: 'snow' }      // Christmas / winter
  ];

  function resolveAutoPreset(date, calendar) {
    date = date || new Date();
    const list = calendar || SEASONAL_CALENDAR;
    const year = date.getFullYear();
    const t = date.getTime();
    for (let i = 0; i < list.length; i++) {
      const entry = list[i];
      const start = new Date(year, entry.startMonth - 1, entry.startDay, 0, 0, 0, 0).getTime();
      const end = new Date(year, entry.endMonth - 1, entry.endDay, 23, 59, 59, 999).getTime();
      if (t >= start && t <= end) return entry.preset;
    }
    return null;
  }

  const DEFAULTS = {
    preset: null,
    imageUrl: '',
    icons: [],
    content: [],
    colors: [],
    fontFamily: '',
    shape: 'circle',
    behavior: 'fall',
    count: 40,
    minSize: 20, maxSize: 45,
    minDuration: 6, maxDuration: 12,
    drift: 12,
    rotate: false,
    minDistance: 80, maxDistance: 240,
    gravity: 60,
    burstIntervalMs: 900,
    trail: false,
    trailColors: [],
    zIndex: 9999,
    durationMs: 2200
  };

  const SeasonalOverlaysLibrary = {
    presets: PRESETS,
    calendar: SEASONAL_CALENDAR,
    resolveAutoPreset: function (date) { return resolveAutoPreset(date, this.calendar); },

    start: function (options) {
      this.stop(); // clear any run already in progress

      options = Object.assign({}, options);
      let presetName = options.preset;

      if (presetName === 'auto') {
        presetName = this.resolveAutoPreset(new Date());
        if (!presetName) {
          console.info('SeasonalOverlaysLibrary.start: no seasonal preset configured for today');
          return;
        }
      }

      const preset = presetName ? PRESETS[presetName] : null;
      if (presetName && !preset) {
        console.warn('SeasonalOverlaysLibrary.start: unknown preset "' + presetName + '"');
      }

      const opts = Object.assign({}, DEFAULTS, preset || {}, options);

      // Shorthand: a single imageUrl becomes a one-item icons array, and
      // layers on top of (reskins) whatever preset motion was requested.
      if (opts.imageUrl && !options.icons) {
        opts.icons = [opts.imageUrl];
      }

      styleEl = document.createElement('style');
      styleEl.id = STYLE_ID;
      document.head.appendChild(styleEl);

      container = document.createElement('div');
      container.id = 'seasonal-overlays-container';
      Object.assign(container.style, {
        position: 'fixed',
        inset: '0',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: String(opts.zIndex)
      });
      document.body.appendChild(container);

      if (opts.behavior === 'burst') {
        spawnFireworkBurst(opts);
        burstInterval = window.setInterval(function () { spawnFireworkBurst(opts); }, opts.burstIntervalMs);
      } else if (opts.behavior === 'fly') {
        for (let i = 0; i < opts.count; i++) {
          container.appendChild(createFlyParticle(opts));
        }
      } else {
        for (let i = 0; i < opts.count; i++) {
          container.appendChild(createFallParticle(opts));
        }
      }

      if (opts.durationMs) {
        stopTimer = window.setTimeout(function () { SeasonalOverlaysLibrary.stop(); }, opts.durationMs);
      }
    },

    auto: function (options) {
      this.start(Object.assign({ preset: 'auto' }, options));
    },

    stop: function () {
      if (stopTimer) { clearTimeout(stopTimer); stopTimer = null; }
      if (burstInterval) { clearInterval(burstInterval); burstInterval = null; }
      flyTrailTimers.forEach(function (t) { clearInterval(t); });
      flyTrailTimers = [];
      if (container) { container.remove(); container = null; }
      if (styleEl) { styleEl.remove(); styleEl = null; }
    }
  };

  // Click delegation: any element tagged with data-overlay or
  // data-overlay-preset triggers the effect on click — img, button, div,
  // doesn't matter. Delegated on document so it also works for elements
  // added to the page after this script runs. Runs alongside manual
  // SeasonalOverlaysLibrary.start() calls; neither disables the other.
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-overlay], [data-overlay-preset]');
    if (!trigger) return;

    const imageUrl = trigger.getAttribute('data-overlay');
    const preset = trigger.getAttribute('data-overlay-preset');
    if (!imageUrl && !preset) return;

    const overrides = {};
    if (preset) overrides.preset = preset;
    if (imageUrl) overrides.imageUrl = imageUrl;
    if (trigger.dataset.overlayCount) {
      overrides.count = Number(trigger.dataset.overlayCount);
    }
    if (trigger.hasAttribute('data-overlay-infinite')) {
      overrides.durationMs = null;
    } else if (trigger.dataset.overlayDurationMs) {
      overrides.durationMs = Number(trigger.dataset.overlayDurationMs);
    }

    SeasonalOverlaysLibrary.start(overrides);
  });

  window.SeasonalOverlaysLibrary = SeasonalOverlaysLibrary;
})(window, document);
