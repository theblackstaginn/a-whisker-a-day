# Hearth v2.4 development — NOT release verified

Baseline: main dd8be6307b228795c72179e94f5c697a5af7eeae (v2.3).

## Artwork milestone

Built-in image generation used assets/yarrow-storybook.webp as identity/style reference. No tabby or calico generation was used.

- assets/hearth-v24/apothecary.webp: portrait 1024×1536 environment, warm ink/gouache apothecary, edge shelves of amber jars and herbs, daylight window, left hearth, central sage cushion and wood surface. No baked character.
- assets/hearth-v24/yarrow-parts.webp: transparent 1536×1024 painted anatomy atlas generated using the original Yarrow AND this environment as references. Solid black fur, amber eyes, sage ribbon, brass crescent. Top row: head, left ear, right ear. Bottom row: torso, two front legs, tail. Atlas alpha checked; the apparent dark sheet backdrop in the generator preview is transparent.

Prompt constraints: same fine ink and textured storybook gouache as original; warm upper-left lighting; no text, no tabby stripes, no calico, no white markings, no brown coat; natural fur edges and hidden root underlap. Separate anatomy in six cells; no baked shadows. WebP conversion uses quality 92, alpha quality 100; original reference is unchanged.

## Implementation milestone

Nested SVG viewports sample one atlas. Named groups independently transform head, both ears, each front leg/paw, and tail. Body breathing is separate. Existing pet, blink, tilt, knead, offer, swish and celebration controller hooks retained, along with wardrobe overlays. The ribbon and charm are painted into the torso; they are not independently rigged. No walking or full-body articulation claim.

The embedded source copies remain synchronized. App state key, app event handlers, journal, rituals, garden, wardrobe and settings logic are preserved. The service worker precaches both new artwork files in a versioned development cache. No storage migration or reset.

## Validation and release gate

Baseline npm test passed before editing. Development source tests and controller tests are recorded separately. Static assembled SVG inspected (not a browser screenshot). This managed environment has no supported control-browser capability; mobile browser QA could not run. Do not merge to main or describe this as a completed Hearth release until the checks below pass.

- Inspect at 320, 390 and 430 CSS px in a browser, at both device-pixel ratios and landscape.
- Capture idle, tilt extrema, individual ear twitches, alternating knead and tail extrema. Check joints for exposed gaps, doubled fur edges or clipped neighboring atlas cells.
- Inspect blink coverage and wardrobe alignment in Hearth and profile.
- Check taps and keyboard focus, motion toggle, system reduced motion, large text, low effects and all existing settings.
- Seed v2.3 progress, load development build and verify rituals, journal, moods, garden, petals and wardrobe remain intact after reload.
- Verify service-worker upgrade then offline launch, navigation and both assets without network.

Known limitations: visual joint motion and mobile layout remain UNVERIFIED. Painted blink overlays and inherited wardrobe placement require browser inspection. PNG generation originals remain in the generating conversation; optimized reusable WebP sources are versioned here.

## Follow-up static pose review

Ran `node scripts/render-rig-review.cjs /tmp/whisker-rig-review.png` with Sharp. This renders authored SVG transforms at selected extrema, not CSS animation in a browser. Reviewed idle, head tilt, ears, left knead, tail extreme, closed blink, hat plus tilt, flowers plus tilt, and right paw offer.

Fixed observed defects: replaced round eye blackout discs with closed-lid contours and creases; lowered floating hat/crown to the forehead and parented both to the moving head. Sampled anatomy extrema showed no obvious open joint gaps at the rendered review scale. This does not establish seamless motion between frames or phone rendering. Comforting mood now retains slower torso breathing and idle head movement on the new groups.

All existing source/controller tests pass after corrections. Mobile browser, actual saved-progress upgrade, service-worker upgrade and CSS animation interpolation remain pending.
