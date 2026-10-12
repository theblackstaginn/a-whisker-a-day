# Yarrow — painted seated master, art-first rebuild

**Development-only milestone.** Main and the installed PWA are unchanged. The experimental wooden rig is deliberately excluded from the character preview.

## Why we started again

Phone review of the joint-driven SVG prototype showed rigid block legs, angular body, visible limb seams and a missing head during side-turn. Correct mathematical joints do not compensate for incorrect artwork. Preserve the reusable idea of state transitions but do not expose placeholder geometry.

## Source of truth

- Original approved character painting: `assets/yarrow-storybook.webp` — fluffy black familiar, luminous amber eyes, sage ribbon, brass crescent.
- Existing painted transparency atlas: `assets/hearth-v24/yarrow-parts.webp` — separate painted head, ears, torso, front paws and tail.
- Matched environment: `assets/hearth-v24/apothecary.webp`.
- The preview retains `yarrow-cutout.js` and its `storybookSvg` seven image samplers, without editing its embedded copy or the app data schema.

## Current art-first milestone

- New `yarrow-painted-seat.html` is an independent, no-storage, no-service-worker browser page.
- New `yarrow-painted-seat.css` animates only painted anatomy: small chest motion, face and ear attention, tail motion, blink and conservative paw gestures.
- All currently available wardrobe choices follow the existing head, neck or torso groups; scarf fabric has a restrained trailing motion.
- This page intentionally contains **no standing, stretched or side-facing preview**. Those need matching genuine painted master artwork and must not be improvised by squashing the seated asset.
- Real Chrome rendering is checked by `scripts/verify-painted-seat.cjs`, which exercises the live preview controls and captures viewport/wardrobe samples via GitHub Actions. Automated DOM testing cannot assess painterly seam quality by itself.

## Visual review gate

1. Manually inspect the stored Chrome screenshots at 320, 375, 390 and 430px, as well as scarf, cape and hat, and correct misalignment before showing the page for iPhone review.
2. Keep the unmodified original reference character readily visible during art review: preserve fur color, amber irises, ear shapes, ribbon and charm.
3. Only after painted seated Yarrow is consistent, commission or paint a matching standing silhouette and independently overlapping limb joints. Validate a static stand before animating sit→stand.
4. Follow with a dedicated stretch pose and distinct side-profile head/body artwork. Never mimic turning with `scaleX`, `skewY` or crossfading an unpainted silhouette.
5. Preserve wardrobe positioning, motion accessibility, local storage (`a-whisker-a-day.v1`) and offline PWA when reintegrating, then test on an actual iPhone.

## Running the preview

- Direct branch page: `yarrow-painted-seat.html`
- Test: `node scripts/verify-painted-seat.cjs` (requires Chrome or Chromium).
- This is not a production deployment. It is intentionally independent of user progress.

**Do not merge to main until the owner approves a visually finished animation on iPhone.**
