# Yarrow — Living Familiar Rig: Production Asset Plan

**Project:** A Whisker a Day  
**Next character milestone:** v1.4 — One Living Familiar  
**Baseline:** GitHub Pages v1.3; preserve all ritual, mood, journal, garden, and wardrobe features.

## Creative lock

One **recognizable, consistent** Yarrow: a velvety charcoal-black cat with long, finely painted fur, warm amber eyes, a delicate brass crescent charm, and a gently curious expression. Her world is an earthy **hedge-witch apothecary manga storybook**: parchment, cream, sage, moss, mahogany, terracotta, amber glass, candlelight, pressed flowers, old books, and herbal detail. Warm daylight is as important as moonlit scenes.

**Do not:** replace Yarrow with different complete portraits frame-by-frame; alter her proportions, amber eye color, ear shape, collar, charm, viewpoint, or lighting between expressions; draw visible paper-doll hinges; require a paid animation subscription.

## Art pipeline

- **One master pose** drawn as truly separate, overlapping layers. Use a free layered editor such as Krita; retain an editable OpenRaster `source/yarrow-master.ora` or an editable master SVG. The current v1.3 full-body atlas is a reference, **not** a rig.
- Work on a transparent **1024 x 1024 px** canonical canvas with Yarrow centered and a consistent floor/ground contact. Export each raster art layer as alpha-preserving WebP or PNG **on that same 1024 x 1024 coordinate system**. Do not crop layers independently; the aligned canvas is intentional.
- Give overlapping joints **hidden fur underlap** so small rotations, shifts, and scale changes do not reveal holes. No painted drop shadows attached to moving limbs; shadows have their own layer.
- Keep the apothecary environment **separate from Yarrow**, so we can animate the familiar without dragging scenery with her. Source files belong to the project owner.
- Future mobile optimization: a small atlas or separate compressed raster layers and CSS/SVG transforms, with no JavaScript frame-by-frame layout thrashing.

## Required artwork / asset list

Priority legend: **P0** = first rig release, **P1** = next character actions, **P2** = ambient polish.

| Priority | Proposed export | Contents / purpose | Motion |
|---|---|---|---|
| P0 | `body.webp` | Constant torso + hindquarters; fur overlaps under neck and front legs | slow chest/body breathing |
| P0 | `chest-ruff.webp` | Soft fur framing the front chest | small rise/fall, slightly delayed |
| P0 | `head.webp` | Face/cheeks/muzzle **without** movable ears or eye details | turn, tilt, nuzzle |
| P0 | `ear-left.webp` | Separate ear, extra fur behind hinge | ear twitch and attention |
| P0 | `ear-right.webp` | Matching, independent ear | independently twitches |
| P0 | `eyes-open.webp` | Matching irises, pupils, glints, no full face | default gaze |
| P0 | `eyes-half.webp` | Consistent eyelid overlay, not a different face | slow blink transition |
| P0 | `eyes-closed.webp` | Same eye placement/face geometry | blink and purr |
| P0 | `front-paw-left.webp` | Front foreleg and paw, overlapping chest | tiny steps, kneading |
| P0 | `front-paw-right.webp` | Second leg/paw independent of left | alternate knead |
| P0 | `tail-base.webp` | Tail root connected behind torso | low-amplitude swish |
| P0 | `tail-tip.webp` | Soft curved tail end with hidden overlap | delayed curl/flick |
| P0 | `collar.webp` | Narrow collar aligned around neck | subtle head-follow sway |
| P0 | `crescent-charm.webp` | Recognizable brass crescent, separate from collar | delayed pendulum swing, occasional glint |
| P0 | `floor-shadow.webp` | Soft shadow beneath Yarrow | slight stretch on posture changes |
| P1 | `whiskers-left.webp` and `whiskers-right.webp` | Fine consistent whiskers | tiny tremble |
| P1 | `mouth-neutral.webp` and `mouth-content.webp` | Subtle muzzle expression variants | purr, sleepy smile |
| P1 | `muzzle-bridge.webp` | Blends moving head and cheeks near facial overlays | prevents cutout seams |
| P1 | `paw-pads.webp` | Under-paw art visible during stretch/knead | articulated paw posing |
| P2 | `fur-highlight.webp` | Very subtle painted rim light | warm time-of-day tint |
| P2 | `magic-spark.webp` | Independent glints and spark particles | event response only |

These paths are **planned**; they are not claims that the exported rig assets already exist.

## Layer order and rig groups

Back to front: ground shadow → tail base/tip → rear body → torso → chest ruff → front legs/paws → neck/collar → head → ears → eyes/lids → muzzle/whiskers → crescent charm → light/spark effects.

Build a single `<svg>` or transformable DOM character with named groups (`yarrow-root`, `torso`, `head`, `ear-left`, `ear-right`, `eye-left`, `eye-right`, `paw-left`, `paw-right`, `tail-base`, `tail-tip`, `collar`, `charm`, `shadow`, `fx`). Each group must have a defined rotation / transform origin within the canonical coordinate system. Place ear pivots at their roots, tail at the rump, head at the neck, paws at shoulder joints, and charm at its suspension loop.

The controller applies smooth, low-angle transforms to **parts of the same art**. Replacing just the **eye** layer during a blink is acceptable; switching Yarrow's entire portrait is not.

## Animation behaviors and layer involvement

| Behavior | Moving layers | Timing / feel | Trigger |
|---|---|---|---|
| Resting idle | torso, chest, charm, tail tip | breathing 3.8–5.5 s, continuously | default |
| Slow blink | lids/eyes only | 250–550 ms with random 3–8 s spacing | idle and pet |
| Ear twitch | one ear at a time | 180–400 ms, sparse | idle/attention |
| Head tilt | head plus eye/ear child layers; charm follows | 450–900 ms eased | curious / Moon Mirror |
| Tail swish | tail base and delayed tip | 2–4 s, restrained | quiet idle |
| Pet / purr | head nuzzle, eyes half shut, chest, charm | ~1.5–2.5 s | tapping Yarrow |
| Gentle knead | left/right paws alternating, torso | 2–4 s | comfort / button |
| Stretch | torso/head down and forward, paws extend, tail rises | 2–3 s, controlled range | morning / button |
| Step closer | body/root, independent paws, head | 1–2 small steps | welcome / button |
| Happy acknowledgment | ear lift, tail tip, charm glint | 0.7–1.4 s | completed ritual |
| Sleepy idle | slower breathing, softer lids, less tail motion | continuous | night / calming mood |

### Behavior controller

The core is a small finite-state controller with a persistent base state (resting, alert, cozy, sleepy), temporarily preempted by a response (pet, curious, happy) or an activity (knead, stretch, step, settle). Independent micro-behaviors (breath, blink, ear, tail, charm) continue while appropriate. Never launch competing transforms on the same part without a priority/cancellation rule.

- Base context: local time + user's **self-reported** mood (avoid assuming emotion from device data).
- Direct user action takes priority over ambient motion; after a reaction, transition back to the appropriate idle state.
- Favor CSS transform animations / Web Animations API over re-rendering the full app.
- Suspend unnecessary animations while the page is hidden; respect `prefers-reduced-motion` and the existing app motion setting; don't autoplay audible purring until a user gesture.
- Keep buttons touch-friendly, keyboard accessible, and labeled.

## MVP build order (no redesign of working features)

1. Draw the **master layered Yarrow** with immutable proportions. Verify layers compose into exactly one clean character, at phone scale and full size.
2. Implement **breathing + blink + ear twitch + tail swish + charm sway** with no full-frame swaps. These must look good without interaction.
3. Add **tap-to-purr/head nuzzle** and ritual-completion acknowledgment.
4. Integrate restrained **knead, stretch, and approach** actions. Keep movement within the existing Hearth boundaries.
5. Add night/cozy timing and visual polish, with no forced motion.
6. Test mobile layouts and revisit only graphics that demonstrably interfere with text or buttons.

## Acceptance tests

- **Identity:** Scrub the animation at arbitrary instants; Yarrow's muzzle, ear shape, eye spacing, fur, and charm remain visibly the same.
- **Continuity:** No hard crossfades between whole-body photographs for idle, blink, head tilt, or pet; no exposed seams or jitter at joints.
- **Comfort:** Ambient movement feels alive but never frantic or distracting; reduced-motion mode leaves the app readable and functional.
- **Interaction:** Tap, knead, stretch, and pet controls respond without losing the user's place; use safe focus/keyboard semantics.
- **Performance:** Smooth on a typical iPhone-sized Safari screen, without excessive battery use; avoid large all-page repaints.
- **Regression:** Today's rituals, mood check-in, grimoire save/edit, garden progress, backup/restore, tabs, and installable PWA continue working.
- **Data:** Retain the existing `a-whisker-a-day.v1` local storage key and schema. Don't migrate, clear, or overwrite user progress as part of an animation update.
- **Review:** Test at 320, 375, 390, and 430 CSS px widths and desktop. Verify after a new load and in a returning session.

**Definition of done:** Ten seconds of unprompted Hearth idle footage looks like a *single living Yarrow* rather than a slideshow of similar cats.
