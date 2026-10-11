# A Whisker a Day — v2.3

**A little everyday magic.** A private, installable self-care storybook featuring Yarrow, a velvety black cat familiar with amber eyes, a sage ribbon and brass crescent charm.

## Included

- **The Hearth:** living cozy apothecary scenes, daily ritual progress, Yarrow's interactive animations and companion messages.
- **Rituals:** daily checklists, custom habits, one-time daily rewards, petals and friendship.
- **Moon Mirror:** optional mood check-ins with gentle reflections.
- **Grimoire:** private journaling with editing, deleting and optional prompts.
- **Cottage & herb garden:** garden growth through rituals, collectible plants and decorations.
- **Yarrow:** friendship, outfits, short story chapters, independently animated ears, head, front arms, paws, tail-tip, eyes, collar charm and purrs.
- **Preferences and portability:** optional sound/motion, time-of-day light settings, export and restore backups.

## v2.3 — Whole, unbroken Yarrow

- Removed the failed hard-edged tracing that cut the original painted illustration into jagged head and torso pieces on iPhone.
- Her Hearth and Familiar appearances now display **one complete original painting** with a gently feathered storybook vignette; no shoulder or paw pixels are carved away.
- Interactive petting, blink, tiny body motions, friendship and five action controls still function. Whole-image gestures are intentionally subtle: independent leg animation needs purpose-drawn matching painted parts.
- No other feature, user's local progress, or image asset is replaced. Offline cache is refreshed.

## v2.2 — Original illustrated Yarrow

- Reuses the **exact 440 × 700 WebP illustration** from the herb-garden story card as the character texture throughout the Hearth and Familiar views. The old geometric character is no longer shown.
- Removes the pale illustration background with a carefully traced character silhouette, placing the familiar naturally into the existing apothecary scene.
- Keeps a small-scale head tilt, breathing, gentle blink, purr and gesture feedback from the same painted artwork. Paw gestures are restrained for now while we prepare truly separate painted foreleg layers; this version does **not** pretend to offer full jointed animation.
- Places the same original painting in a reusable `assets/yarrow-storybook.webp` file, reducing duplicate markup and caching it for offline use.
- Preserves outfits, friendship, rituals, the journal, the garden, and the existing local storage key.

## v2.1 — Yarrow's gentler expressions

- Animated **true eyelid overlays**, clipped precisely to her amber eyes, replace unnatural eye-squashing when blinking or purring.
- Tiny coordinated glances move her pupils and eye highlights independently of her face, like a curious familiar watching the room.
- The reduced-motion setting leaves her eyes open, avoiding an eyelid-overlay accessibility regression.
- Her jointed limbs, tail, outfits, rituals, grimoire, garden, and saved progress are unchanged.

## v2.0 finish pass

- Retired the old inlined full-body photo/triangular mesh prototype; the single jointed SVG is now the supported Yarrow implementation. This makes the HTML significantly lighter without changing ritual, journal or garden logic.
- Yarrow celebrates the **first** completion of each daily ritual with a happy animation.
- All five interaction buttons are visible in a phone-friendly grid rather than partially hidden in horizontal scrolling.
- Synchronized the in-app version, editable rig sources and offline cache.
- Added basic share metadata and a dependency-free source smoke-test (`npm test`) for future edits.
- Softened the inked fur detail while retaining our warm herb-garden storybook style.

## Important artwork limitation

This is a hand-built **2D paper-cut animation** using the same character art for every movement. It is *not* hand-drawn full-frame anime. Full standing, running or rolling poses would need additional purpose-drawn artwork; they're deliberately not simulated through body-distorting warps.

## Run and install

**GitHub Pages**: publish the `main` branch from `/(root)`. This self-contained `index.html` is ready for static hosting.

**iPhone**: Safari → Share → Add to Home Screen. **Android**: use your browser's Install / Add to Home Screen command. After installation, visit once online so the shell can cache.

To verify local source files on Windows or macOS, use `npm test` (Node 18+; no `npm install` required).

## Privacy and backup

Your journal, mood check-ins and progress stay on that device, in browser storage under **`a-whisker-a-day.v1`**. The storage key intentionally has **not** changed, so existing progress survives this upgrade. Download a JSON backup from Settings before clearing browser storage or moving phones. There is no account, tracking or paid subscription.
