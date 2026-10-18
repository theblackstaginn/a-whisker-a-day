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
assert.ok(index.includes("const STORAGE_KEY = 'a-whisker-a-day.v1'"),'Preserve existing user data key');
assert.ok(index.includes("window.__whiskerVersion = '2.4.4-dev'"),'Keep release metadata current');
assert.ok(js.includes("version:'2.4.1-dev'"),'Keep character rig version current');
assert.ok(sw.includes("whisker-a-day-v2.4-purr2"),'Offline cache version must track installed assets');
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
assert.ok(!index.includes("hearth-music.ogg"),'Background music is deferred');
assert.ok(!index.includes("toggle-music"),'Background music control is deferred');
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
assert.equal(ctx.window.YarrowCutout.version,'2.4.1-dev');
const poses=['default','hat','flowers','scarf','satchel','cape'];
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
console.log('A Whisker a Day v2.4.4 development: static source checks passed; mobile motion and purr QA still required.');
