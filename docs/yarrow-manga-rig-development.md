# Yarrow — manga-style articulated rig (feature branch, not released)

Branch: `feat/yarrow-manga-rig-20261012`
Parent: `feat/yarrow-stand-stretch-turn-20261012`
Target: **stay off `main` until owner approves on iPhone**.

## Repository inspection

- `main` is still the established v2.3 release. The earlier experimental branch was 7 commits ahead of it when inspected.
- The experimental branch supplies `assets/yarrow-storybook.webp` and `assets/hearth-v24/yarrow-parts.webp`; the original illustration and six-piece painted atlas are preserved byte-for-byte.
- The old motion prototype relies on rotating, translating, skewing and squashing already painted anatomy. It cannot produce a convincing standing cat or a genuinely side-facing silhouette.
- The app embeds an exact copy of `yarrow-cutout.js` and the development CSS in `index.html`. This new implementation does not change either original source: it loads `yarrow-manga-rig.js` afterward, before the app begins, so rollback removes the script/link.

## Implemented milestone — initial skeleton and authored pose masters

- **Five anatomical masters:** seated, crouch/anticipation, four-legged stand, bow/stretch and full sideways stance.
- **Independent point-based anatomy:** torso silhouette spans moving hips and shoulders; neck, head and ruff move separately. Each of four legs has shoulder/hip, elbow/hock and paw/ground-contact nodes, with independently redrawn upper/lower segments and overlapping joint caps. The tail has five linked nodes and four sections.
- **Motion timing:** stand, stretch and turn have multiple key poses, eased in-betweens, anticipation, held extensions and return to sitting. Gestures can be interrupted.
- **Facial identity:** the front head and both ears are sampled from the exact existing painted atlas. Head, ears, isolated eyelids, collar and charm can animate independently.
- **Side view:** a distinct newly drawn muzzle, eye, cheek and head contour instead of squashing the front image. **The side view is provisional vector artwork and needs matching painted refinement before approval.**
- **Wardrobe:** hat, flower crown and beret ride the head; ribbon, scarf, star and acorn ride the neck; satchel and cape ride the torso.
- **Secondary motion:** breathing, ear twitches, tail tip, pendulum charm, blink, purr, kneading, tail swish and gratitude glints.
- **Accessibility:** motion pauses while the page is hidden, honors system reduced-motion and the app's motion-off setting, and disposes handlers/frames on navigation.
- **Privacy:** no localStorage changes, migrations or progress resets. The original rituals, garden, journal, backups, settings and PWA code remain intact. Service worker precaches the rig JS/CSS in a new versioned cache.

## QA gate — not passed yet

Static/controller tests can verify interpolation and preservation of invariants. They **cannot** prove pleasant motion, seamless fur, stable iPhone frame rate, browser compositing, or service-worker upgrade reliability. These require Safari and visual testing.

The initial front body and articulated limbs are hand-inked vector work, not yet as finely painted as the existing atlas. Fur underlaps, side-profile paint, scarf drape and toe placement need careful visual review. We should develop pose-specific layered painted masters using these joint coordinates before calling the animation complete.

## iPhone preview

A standalone `rig-preview.html` is included in this development branch. It has controls for stand, stretch, turn, tilt, knead, swish, wardrobe selection and reduced motion, without touching app data or installing a PWA.

Possible third-party branch preview (verify CDN works before relying on it):
https://raw.githack.com/theblackstaginn/a-whisker-a-day/feat/yarrow-manga-rig-20261012/rig-preview.html

GitHub source browser:
https://github.com/theblackstaginn/a-whisker-a-day/blob/feat/yarrow-manga-rig-20261012/rig-preview.html

Keep `main` and the released Pages URL unchanged until approval. Inspect at 320/375/390/430px Safari widths; test action interruption, joint overlap, outfits, reduced-motion, hidden-page behavior, return-user state, and an offline upgrade.

## Rollback

Remove the experimental script tag and CSS link from `index.html`, and revert the service worker cache list. Neither the original `yarrow-cutout.js` nor original assets were overwritten, and the saved-data key remains unchanged.
