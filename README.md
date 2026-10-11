# A Whisker a Day — Yarrow Inked Storybook Familiar v1.9

A real, installable self-care storybook app with daily rituals, a gentle Moon Mirror, a private journal, a herb garden and a little black cat familiar. 

## New in v1.9

* Refinement toward the existing *In the Old Herb Garden* pen-and-watercolor style: tufted silhouette, fine etched fur, painted ear detail and textured sage ribbon.
* Keeps the v1.8 independent limb and tail animations. No whole-body picture switching.
* This is still a custom SVG cutout, not the original painted image remastered into separate layers. Full hand-painted animation will require a clean layered illustration.

## Earlier v1.8 improvements

* Each front paw now has an independent shoulder, forearm and wrist/paw group for natural alternating kneading and jointed paw offers.
* The tail has a separately animated, delayed curling tip.
* Hats and flower crowns now follow the head when Yarrow tilts.
* All saved progress, other self-care features and offline support remain intact.

## Original cutout release

* Replaces photo-switching and warping with an authored SVG cutout character inspired by earthy cottage storybooks and simple, expressive cutout animation.
* Ears, eyes, face, torso, left front paw, right front paw, tail and moon charm have separately controlled animation. The character remains the same illustration in every state.
* Includes soft idle breathing, blinking, tail swishing, curious head tilt, purring, alternating paw offers, and kneading. Reduced-motion users keep a static character and normal app functionality.
* The main `index.html` is self-contained for deployment and offline reliability. The editable CSS and JS are included as separate source files.
* Rest of app (rituals, mood check-ins, Grimoire, friendship, cottage and garden, petal rewards, storage and export) remains intact. Local storage key is unchanged: `a-whisker-a-day.v1`.

## Deploy

Place `index.html`, `sw.js`, `app-icon.svg`, `manifest.webmanifest` in a GitHub Pages repository root. Choose **Deploy from a branch**, `main`, `/(root)` in Settings → Pages. The self-contained index does not require the separate `yarrow-cutout` files.

## Reality check

This is deliberately an *illustrated cutout animation*, not full hand-drawn anime, 3D rigging, or automatically generated intermediate frames. Full-body locomotion or a convincing long stretch will require new key drawings, and are not claimed in this release.

## Privacy

Journal and progress data stay in the browser on that device. Export a backup from settings before clearing local data or moving devices. No account required.
