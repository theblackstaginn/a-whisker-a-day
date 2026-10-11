# A Whisker a Day — Living Familiar v1.6

Yarrow is a black-cat familiar in a warm hedge-witch apothecary self-care storybook. The app runs locally in the browser as an installable PWA and does not require an account or a subscription.

## What changed in v1.6

- **Two independently moving front paws.** The new **Offer a paw** interaction alternates between Yarrow's left and right forelegs. **Make biscuits** alternates their positions on separate timing curves, so the two paws don't simply move together.
- **Continuous fur rendering without cutout seams.** The renderer bends a single master illustration over one shared mesh. A software pixel rasterizer eliminates the visible triangular grid/clip lines from the earlier release.
- **Motion easing and priority.** Motion channels ease smoothly into and out of actions, including when an action is interrupted; breathing, slow blinking, ears, tail, charm, curious tilt, petting and purring remain supported.
- **Mobile-friendly.** The implementation adapts rendering frequency to observed frame cost, pauses offscreen, and respects both the user's motion setting and `prefers-reduced-motion`.
- **No app-data changes.** Rituals, Moon Mirror check-ins, Grimoire journal, cottage, garden, outfits, rewards, backup functionality, and the existing `a-whisker-a-day.v1` localStorage key were kept.

## What this release does **not** yet claim

Yarrow still has **one seated master illustration**. This release gives the **visible front legs** independent, blended movement within that pose. Full standing, walking, turning around, jumping and full-body stretches still require separately illustrated anatomical key poses and hand-tuned in-between animation. This is an incremental quality milestone, not finished television-quality manga animation.

## How to try it

If GitHub Pages is enabled, open https://theblackstaginn.github.io/a-whisker-a-day/ in Safari and tap **Offer a paw** twice to see the opposite front legs move. Then try **Make biscuits**. On iPhone, use Safari's Share menu → Add to Home Screen to install.

## Files

- `index.html` — the complete working app, including embedded art (no build step required)
- `manifest.webmanifest` and `app-icon.svg` — PWA metadata and icon
- `sw.js` — network-first offline cache with a v1.6 cache name
- `source/yarrow-independent-limbs.js` — readable self-contained animation-controller section from the app (depends on the surrounding app variables)
- `source/yarrow-master.webp` and `source/yarrow-eyelids.webp` — original master image and expression overlay used by the code
- `tests/` — local browser regression and pose proofs

## Privacy and testing

Progress is stored in the current device's browser. Changing device or browser does not synchronize it automatically; use Settings → Export Backup. No journal entries are uploaded by this app.

Tested in headless Chromium at 320, 375, 390, 430 and 1024 CSS pixels, with reduced motion; browser-only save and restore simulation; and basic flow tests for rituals, journal, garden, mood, navigation and petting. Real iPhone Safari performance/appearance still needs a user-device check.