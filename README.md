# A Whisker a Day — v1.5 Seamless Motion

A self-contained, installable, browser-based, hedge-witch-apothecary self-care app featuring Yarrow, a warm-hearted black cat familiar.

## What changed

- Replaced cut-apart cat layers and CSS pose swaps with **one continuously deformed master painting** drawn on an HTML canvas.
- Breathing, eyelids, head movement, ears, tail, paws, body bow/stretch, curious shifts, and purr interactions now morph over connected geometry. No visible cutout boundaries between body pieces.
- Motion is clock-driven using smooth easing, with no abrupt reset of body-part animations.
- Adaptive canvas rendering aims for smooth performance, rather than forced 24 FPS. Pauses when hidden and respects `prefers-reduced-motion` and the app's motion switch.
- Preserved existing daily rituals, Moon Mirror check-ins, journal, garden, decorations, wardrobe options, and device-local save data.

**Important distinction:** This is the seamless motion foundation, **not** yet the final frame-by-frame hand-drawn anime performance. The current illustrated sitting master can bend, stretch, and shift, but convincingly transitioning to walking or full standing poses will require newly illustrated matching key poses and hand-tuned in-between frames. The older full-pose art was inconsistent and is deliberately no longer crossfaded.

## Files

- `index.html` — app, code, and embedded scene art; no build step needed
- `manifest.webmanifest` — PWA metadata
- `app-icon.svg` — home-screen icon
- `sw.js` — network-first offline service worker cache (v1.5)
- `source/yarrow-master.webp` — master Yarrow art used for continuous character animation
- `source/yarrow-eyelids.webp` — localized eyelid overlay for real blinks
- `source/fluid_character.js` — readable animation controller source
- `source/fluid_character.css` — character rendering CSS
- `source/build.py` — reproducible build from the prior v1.4 snapshot

## Local-first privacy

User progress remains saved under `a-whisker-a-day.v1` in localStorage. This release does not migrate, clear, or replace saved progress. Journal entries are not uploaded. Download backups from Settings before making major changes, switching devices, or changing domains.

## Install on iPhone

Open https://theblackstaginn.github.io/a-whisker-a-day/ in Safari, press Share, then Add to Home Screen. If using ChatGPT's in-app browser, open the site in Safari first. If the old visual remains cached, refresh or close and reopen the app.

## Next production pass

Hand-draw consistent animated key poses for Yarrow, especially true four-legged stretch, walk, turn, and settle; add controlled in-between frames so these changes read as genuine 2D manga animation without a photo swap.