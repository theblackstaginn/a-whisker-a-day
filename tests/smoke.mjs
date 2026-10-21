import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=(file)=>fs.readFileSync(path.join(root,file),'utf8');
const index=read('index.html');
const css=read('yarrow-cutout.css');
const js=read('yarrow-cutout.js');
const sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const storybook=fs.readFileSync(path.join(root,'assets/yarrow-storybook.webp'));
assert.equal(storybook.toString('ascii',0,4),'RIFF','Original Yarrow portrait must be a real WebP');
assert.ok(storybook.length>50000,'Full painted Yarrow asset should be present');
assert.ok(js.includes('storybookSvg(outfit)'),'Use the reference-derived painted rig in every scene');
assert.ok(js.includes('yr-book-lids'),'Preserve illustrated blink reaction');
assert.ok(index.includes('src="./assets/yarrow-storybook.webp"'),'Herb-garden story card should reuse exact same image');

assert.ok(index.includes(js),'Self-contained index must include current Yarrow source');
assert.ok(index.includes(css),'Self-contained index must include current animation CSS');
assert.ok(index.includes('color-scheme:dark'),'Dark mode remains the default after restoring legacy Yarrow motion');
assert.ok(index.includes('<meta name="theme-color" content="#101512">'),'Dark browser theme color remains active');
assert.ok(index.includes('mix-blend-mode:normal'),'Dark gratitude jar must not multiply itself into the page background');
assert.ok(index.includes('#gratitude-note{'),'Dark gratitude note field keeps dedicated contrast styling');
assert.ok(index.includes("const STORAGE_KEY = 'a-whisker-a-day.v1'"),'Preserve existing user data key');
assert.ok(index.includes("window.__whiskerVersion = '2.5.0-dev'"),'Keep release metadata current');
assert.ok(js.includes("version:'2.5.0-wearables1'"),'Keep character rig version current');
assert.ok(sw.includes("whisker-a-day-v2.5-shell2"),'Offline cache version must track installed assets');
assert.ok(sw.includes("'./assets/cottage-reading-nook.webp'"),'Cottage art must be available offline');
assert.ok(sw.includes("'./assets/Jar.PNG'"),'Gratitude jar image must be available offline');
assert.ok(index.includes('if(modalRoot.innerHTML)openGratitudeJar()'),'Removing a gratitude note should refresh the open jar');
assert.ok(!index.includes('YARROW_FLUID_ART'),'Do not ship obsolete monolithic photo/mesh prototype');
assert.ok(!index.includes('createYarrowCanvasMesh('),'Do not ship obsolete triangular mesh renderer');
assert.ok(index.includes("if(firstAward)setYarrowPose('happy',1350)"),'Rituals should animate Yarrow');
assert.ok(index.includes("grid-template-columns:repeat(2,minmax(0,1fr))"),'Phone interaction controls should fit');
assert.equal(manifest.display,'standalone');
assert.ok(manifest.icons.some(i=>i.src==='./app-icon.svg'));
assert.ok(index.includes('function exportBackup()') && index.includes('async function importBackup('));
const purr=fs.readFileSync(path.join(root,'assets/audio/yarrow-purr.mp3'));
assert.equal(purr.toString('ascii',0,3),'ID3','Yarrow purr must be a real bundled MP3');
assert.ok(index.includes("new Audio('./assets/audio/yarrow-purr.mp3')"),'Tap interaction should use the recorded purr');
assert.ok(index.includes("const tappedYarrow=!!source?.closest('.yarrow-puppet,.yarrow-stage,.cat-stage,.photo-yarrow-hit')"),'Purr audio must be gated to direct taps on Yarrow');
assert.ok(index.includes("if(tappedYarrow)playPurr();"),'Only a direct Yarrow tap may start the purr');
assert.ok(index.includes("purrFadeTimer=setInterval"),'Recorded purr should fade before its noisy tail');
assert.ok(index.includes("purrEndTimer=setTimeout"),'Repeated taps should replace the active purr cleanly');
assert.ok(!index.includes("if(state.sound) playPurr(.55)"),'Ritual rewards must not play the purr');
assert.ok(!index.includes("yarrow-meow"),'Meow interaction is deferred');
assert.ok(!index.includes("hearth-music.ogg"),'No copyrighted background music should be bundled in the repo');
assert.ok(index.includes("data-action=\"toggle-music\""),'Settings should include a background music toggle');
assert.ok(index.includes("id=\"music-volume\""),'Settings should include a music volume control');
assert.ok(index.includes("const BUILT_IN_MUSIC_URL = 'https://lpjpuedylongafgqbwjh.supabase.co/storage/v1/object/public/a-whisker-a-day/Forest%20Elves%20-%20Tree%20of%20Life%20(Instrumental).mp3'"),'Tree of Life should be the built-in Supabase soundtrack');
assert.ok(index.includes("musicAudio.loop=true"),'The complete soundtrack should loop only after reaching its end');
assert.ok(index.includes("document.addEventListener('pointerdown',unlockMusic,{once:true,capture:true})"),'The global soundtrack should unlock from the first user interaction');
assert.ok(!index.includes("id=\"music-file\""),'Built-in soundtrack should not require a local file picker');
assert.ok(!index.includes("case 'choose-music'"),'Built-in soundtrack should not expose the retired custom-song action');
assert.ok(!index.includes("merged.music ="),'No unused music preference should remain');
assert.ok(!sw.includes("yarrow-meow"),'Meow audio must not be cached');
assert.ok(!sw.includes("hearth-music"),'Background music must not be cached');
assert.ok(!index.includes("buffer=ctx.createBuffer"),'Retire the procedural wind-like purr synthesis');

/* Optional witchy content must not replace saved user rituals or invent mandatory chores. */
const libraryMatch=index.match(/const RITUAL_LIBRARY = (\[[\s\S]*?\]);\s*const GRIMOIRE_LORE =/);
assert.ok(libraryMatch,'Optional ritual library missing');
const library=JSON.parse(libraryMatch[1]);
assert.equal(library.length,24,'Keep the curated 24-practice library intact');
assert.equal(new Set(library.map(r=>r.id)).size,library.length,'Library IDs must be unique');
for(const ritual of library){
  assert.ok(ritual.id.startsWith('library-'),'Library IDs must be namespaced');
  assert.ok(['Body','Mind','Home','Spirit'].includes(ritual.area),'Library area must be a valid filter');
  assert.ok(ritual.title&&ritual.hint,'Every practice needs a readable title and instructions');
}
assert.ok(index.includes("merged.rituals = Array.isArray(raw.rituals)"),'Existing user rituals must remain authoritative');
assert.ok(index.includes("case 'add-library-ritual'"),'Optional library add action must exist');
assert.ok(index.includes("state.rituals.some(r=>r.id===id)"),'Block duplicate library additions');
assert.ok(index.includes("state.rituals.push({...template})"),'Only opted-in practices join daily tasks');
assert.ok(index.includes("save();render();toast('A new ritual"),'Library additions must persist');
assert.ok(index.includes('const GRIMOIRE_LORE ='),'Grimoire field guide missing');
assert.ok(index.includes('const HERB_LORE ='),'Herbal field guide missing');
assert.ok(index.includes('A tiny cottage blessing'),'Cottage reflection missing');
assert.ok(index.includes('const DEFAULT_DECOR_POSITIONS = Object.freeze({'),'Cottage decor needs stable default positions');
assert.ok(index.includes("activeRoom:'hearth'"),'New saves need a default cottage room');
assert.ok(index.includes("decorRooms:{fern:'hearth'}"),'New saves need item room assignments');
assert.ok(index.includes("decorPositions:{hearth:{},bedroom:{},kitchen:{},crafting:{}}"),'New saves need room-specific decor position maps');
assert.ok(index.includes("const looksLegacyPositions=DECOR.some"),'Legacy flat decor positions need Hearth migration');
assert.ok(index.includes("merged.decorPositions = Object.fromEntries(COTTAGE_ROOMS.map"),'Saved room positions need normalization');
assert.ok(index.includes("data-decor-id="),'Visible cottage decor needs movable handles');
assert.ok(index.includes("const COTTAGE_ROOMS = Object.freeze(["),'Cottage room catalog missing');
assert.ok(index.includes("data-cottage-room="),'Cottage needs a room switcher');
assert.ok(index.includes("data-decor-room="),'Owned decor needs a room selector');
assert.ok(index.includes("function moveDecorToRoom(id,roomId)"),'Decor room reassignment handler missing');
for(const roomAsset of ['hearth.webp','bedroom.webp','kitchen.webp','crafting.webp']){
  assert.ok(sw.includes("'./assets/cottage/rooms/"+roomAsset+"'"),'Room art must be available offline: '+roomAsset);
}
assert.ok(index.includes("setTimeout(()=>{") && index.includes("},480);"),'Decor pickup needs a deliberate long press');
assert.ok(index.includes("function handleDecorPointerMove(event)"),'Decor needs pointer-drag movement');
assert.ok(index.includes("function settleDecorMove(pos=null)"),'Decor needs tap-to-place persistence');
assert.ok(index.includes("if(decorMove&&cottageScene)"),'A cottage tap should settle the lifted item');
assert.ok(index.includes("state.decorPositions[decorMove.roomId][decorMove.id]"),'Placed coordinates must be saved per room');
assert.ok(index.includes("-webkit-touch-callout:none"),'Long press should not open the iOS callout');
assert.ok(index.includes("pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none"),'New cottage comforts must remain touchable on iOS');
assert.ok(css.includes("pointer-events:auto;touch-action:none;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none"),'Companion CSS must keep new cottage comforts touchable');
assert.ok(!index.includes("text-shadow:0 3px 5px #30211677;pointer-events:none"),'No cottage comfort may disable pointer events');
assert.ok(!css.includes("text-shadow:0 3px 5px #30211677;pointer-events:none"),'Companion CSS must not disable cottage pointer events');
assert.ok(!index.includes(".cottage-storybook .decor-overlay.teapot{left:8%;bottom:14%}"),'Saved cottage positions must not be overridden by stale fixed coordinates');
assert.ok(!css.includes(".cottage-storybook .decor-overlay.teapot{left:8%;bottom:14%}"),'Companion CSS must not restore stale fixed cottage coordinates');
assert.ok(index.includes("aria-grabbed=\"false\""),'Movable decor should expose placement state');

assert.ok(!index.includes("{ id: 'crescent', name: 'Moon charm'"),'Moon charm must not return to the wardrobe');
assert.ok(!index.includes("{ id: 'ribbon', name: 'Sage ribbon'"),'Sage ribbon must not return to the wardrobe');
assert.ok(index.includes("raw.outfit==='crescent'||raw.outfit==='ribbon'"),'Legacy permanent-accessory selections must migrate to no extra wearable');
assert.ok(index.includes('Sage ribbon + ☾ moon charm always'),'Permanent Yarrow accessories should be explicit in the wardrobe UI');

assert.ok(index.includes('Tiny woodland discoveries'),'Yarrow nature prompts missing');

for(const label of ['renderHearth','renderRituals','renderGrimoire','renderCottage','renderYarrow']){
  assert.ok(index.includes('function '+label+'('),'Missing feature view: '+label);
}
const scripts=[...index.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(x=>x[1]);
assert.equal(scripts.length,2,'Expected character rig and app entry scripts');
scripts.forEach((source,i)=>new vm.Script(source,{filename:'index-inline-'+i+'.js'}));
new vm.Script(js,{filename:'yarrow-cutout.js'});
new vm.Script(sw,{filename:'sw.js'});
const ctx={window:{}};
vm.runInNewContext(js,ctx,{timeout:3000});
assert.equal(ctx.window.YarrowCutout.version,'2.5.0-wearables1');
const poses=['default','hat','flowers','scarf','satchel','cape','star','beret','acorn'];
for(const outfit of poses){
 const markup=ctx.window.YarrowCutout.render({outfit});
 assert.ok(markup.includes('yr-painted-head')&&markup.includes('yr-book-body')&&markup.includes('yr-painted-tail'),'Painted anatomy missing for '+outfit);
 assert.ok(markup.includes('yr-book-lids')&&markup.includes('yr-book-magic'),'Painted familiar expression layers missing for '+outfit);
 const opens=(markup.match(/<g(?:\s|>)/g)||[]).length;
 const closes=(markup.match(/<\/g>/g)||[]).length;
 assert.equal(opens,closes,'Unbalanced SVG groups for '+outfit);
}
assert.ok(css.includes('yr-book-blink-now') && css.includes('yr-book-breathe'), 'Painterly Yarrow should keep subtle blinking and breathing');
assert.ok(!js.includes('STORYBOOK_OUTLINE') && !js.includes('yr-book-silhouette'), 'Do not bring back the broken hard-edged character mask');
console.log('A Whisker a Day v2.5.0 development: static source checks passed; mobile motion, purr, and cottage placement QA still required.');
