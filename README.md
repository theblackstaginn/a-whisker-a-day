# A Whisker a Day - The Living Familiar (v1.4)

An installable, entirely client-side self-care storybook app with Yarrow, a black cat familiar.

## What changed in v1.4

- Yarrow is now **one canonical illustrated cat** broken into aligned transparent layers.
- The head, ears, eyelids, tail, chest, two paws, and brass charm move independently with CSS/SVG transforms.
- There are **no whole-character photo crossfades** in the new animation system.
- A gentle idle loop, blinking, ear flicks, tail swishes, kneading, stretch, short approach, and tap-to-purr interactions are available.
- Reduced-motion preferences and the app's motion toggle are respected.
- The previously used eight-pose atlas is retired from the production CSS.
- All existing ritual, check-in, journaling, garden, reward and outfit features stay intact.
- Saved progress uses the existing `a-whisker-a-day.v1` key; no data migration.

## Files

- `index.html`: complete self-contained app (artwork embedded; works without asset paths for main UI).
- `manifest.webmanifest`, `app-icon.svg`, `sw.js`: installable app and offline cache.
- `rig/yarrow-master.png`: canonical source illustration. All layer images share the exact 362 x 543 coordinate system; they are intentionally not cropped independently.
- `rig/*.webp` / `rig/*.png`: transparent editable layer exports.
- `rig/make_layers.py`: script to reproduce the aligned PNG/WebP layers from the source pose sheet.
- `rig/living_familiar.css`, `rig/living_familiar.js.txt`, `rig/living_state.js.txt`: motion-system sources.
- `build.py`: reproducible build based on the prior working v1.3 index.
- `tests/`: browser regression scripts and preview captures.

## Run and install

Upload `index.html`, `manifest.webmanifest`, `app-icon.svg`, and `sw.js` to the **root** of your existing GitHub Pages repository, or open the hosted app at
https://theblackstaginn.github.io/a-whisker-a-day/

On iPhone, open the live URL in Safari, then choose Share > Add to Home Screen.

## Privacy and backups

All ritual progress, journals and preferences stay in your browser's local storage and are not sent to an application server. Back up your data periodically in the app's Settings; browser resets can delete local storage. There are no mandatory accounts or subscriptions.

## Quality notes

This is a **first layered puppet rig**, not a Live2D-quality skeletal deformation system. Big moves (such as a full-body arch) use restrained squash, translation, and independently animated paws rather than hand-drawn in-betweens. The important improvement is that she stays one recognizable character at all times.

Tested with headless Chromium at mobile widths, including rendering, independent transforms, ritual completion, journaling, mood UI, garden, and wardrobe navigation. Native iOS Safari review is still needed.