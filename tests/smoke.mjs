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
const manga=read('yarrow-manga-rig.js');
const mangaCss=read('yarrow-manga-rig.css');
const sw=read('sw.js');
const manifest=JSON.parse(read('manifest.webmanifest'));
const storybook=fs.readFileSync(path.join(root,'assets/yarrow-storybook.webp'));
assert.equal(storybook.toString('ascii',0,4),'RIFF','Original Yarrow portrait must be a real WebP');
assert.ok(storybook.length>50000,'Full painted Yarrow asset should be present');
assert.ok(js.includes('storybookSvg(outfit)'),'Use the reference-derived painted rig in every scene');
assert.ok(js.includes('yr-book-lids'),'Preserve illustrated blink reaction');
assert.ok(index.includes('src="./assets/yarrow-storybook.webp"'),'Herb-garden story card should reuse exact same image');

const embeddedRig=index.split('/* Editable in yarrow-cutout.js inside the full source archive */')[1]?.split('</script>')[0]?.trim();
assert.equal(embeddedRig,js.trim(),'Embedded live rig must exactly match yarrow-cutout.js');
for(const key of ['yr-painted-attention','yr-painted-tilt','yr-painted-knead-left','yr-stand-torso','yr-stretch-head','yr-turn-head']){
 assert.ok(css.includes('@keyframes '+key)&&index.includes('@keyframes '+key),'Embedded and reference CSS must preserve '+key);
}
// The standalone CSS contains scene/layout styles relocated within the inline HTML stylesheet;
// compare the character motion definitions rather than requiring one contiguous block.
assert.ok(index.includes("const STORAGE_KEY = 'a-whisker-a-day.v1'"),'Preserve existing user data key');
assert.ok(index.includes("window.__whiskerVersion = '3.0.1-head-visibility'"),'Keep release metadata current');
assert.ok(js.includes("version:'2.4.1-motion-preview'"),'Keep character rig version current');
assert.ok(sw.includes("whisker-a-day-v3-manga-riglab1"),'Offline cache version must track installed assets');
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
assert.equal(scripts.filter(Boolean).length,2,'Expected original embedded rig and app entry scripts');
assert.ok(index.includes('src="./yarrow-manga-rig.js?v=rig-lab1"'),'Load experimental rig before app entry');
assert.ok(index.includes('href="./yarrow-manga-rig.css?v=rig-headfix2"'),'Load experimental rig styles');
assert.ok(sw.includes("'./yarrow-manga-rig.js'") && sw.includes("'./yarrow-manga-rig.css'"),'Offline install must cache rig sources');
assert.ok(!manga.includes('localStorage') && !manga.includes('STORAGE_KEY'),'Rig must not access or migrate user progress');
assert.ok(mangaCss.includes('manga-yarrow'),'Experimental styles must stay scoped');
scripts.forEach((source,i)=>new vm.Script(source,{filename:'index-inline-'+i+'.js'}));
new vm.Script(js,{filename:'yarrow-cutout.js'});
new vm.Script(manga,{filename:'yarrow-manga-rig.js'});
new vm.Script(sw,{filename:'sw.js'});
const ctx={window:{}};
vm.runInNewContext(js,ctx,{timeout:3000});
assert.equal(ctx.window.YarrowCutout.version,'2.4.1-motion-preview');
vm.runInNewContext(manga,ctx,{timeout:3000});
assert.equal(ctx.window.YarrowCutout.version,'3.0.1-head-visibility');
const poses=['crescent','hat','flowers','scarf','satchel','cape','ribbon','star','beret','acorn'];
for(const outfit of poses){
 const markup=ctx.window.YarrowMangaRig.makeSvg(outfit);
 assert.ok(markup.includes('data-part="head"')&&markup.includes('data-part="torso"'),'Rig anatomy missing for '+outfit);
 assert.ok(markup.includes('ym-tail')&&markup.includes('ym-limb'),'Independent manga rig anatomy missing for '+outfit);
 assert.ok(markup.includes('data-part="lids"')&&markup.includes('data-part="glints"'),'Familiar expression layers missing for '+outfit);
 const opens=(markup.match(/<g(?:\s|>)/g)||[]).length;
 const closes=(markup.match(/<\/g>/g)||[]).length;
 assert.equal(opens,closes,'Unbalanced SVG groups for '+outfit);
}
assert.ok(css.includes('yr-book-blink-now') && css.includes('yr-book-breathe'), 'Painterly Yarrow should keep subtle blinking and breathing');
assert.ok(!js.includes('STORYBOOK_OUTLINE') && !js.includes('yr-book-silhouette'), 'Do not bring back the broken hard-edged character mask');
console.log('A Whisker a Day v2.4 development: static source checks passed; mobile motion and seam QA still required.');
