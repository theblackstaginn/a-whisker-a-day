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
assert.ok(index.includes(js),'Self-contained index must include current Yarrow source');
assert.ok(index.includes(css),'Self-contained index must include current animation CSS');
assert.ok(index.includes("const STORAGE_KEY = 'a-whisker-a-day.v1'"),'Preserve existing user data key');
assert.ok(index.includes("window.__whiskerVersion = '2.1.0'"),'Keep release metadata current');
assert.ok(js.includes("version:'2.1.0'"),'Keep character rig version current');
assert.ok(sw.includes("whisker-a-day-v2.1"),'Bump offline cache with each release');
assert.ok(!index.includes('YARROW_FLUID_ART'),'Do not ship obsolete monolithic photo/mesh prototype');
assert.ok(!index.includes('createYarrowCanvasMesh('),'Do not ship obsolete triangular mesh renderer');
assert.ok(index.includes("if(firstAward)setYarrowPose('happy',1350)"),'Rituals should animate Yarrow');
assert.ok(index.includes("grid-template-columns:repeat(2,minmax(0,1fr))"),'Phone interaction controls should fit');
assert.equal(manifest.display,'standalone');
assert.ok(manifest.icons.some(i=>i.src==='./app-icon.svg'));
assert.ok(index.includes('function exportBackup()') && index.includes('async function importBackup('));
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
assert.equal(ctx.window.YarrowCutout.version,'2.1.0');
const poses=['default','hat','flowers','scarf','satchel','cape'];
for(const outfit of poses){
 const markup=ctx.window.YarrowCutout.render({outfit});
 assert.ok(markup.includes('yr-tail-tip')&&markup.includes('yr-left-forearm')&&markup.includes('yr-right-paw'),'Jointed pieces missing for '+outfit);
 assert.ok(markup.includes('yr-lid-left')&&markup.includes('yr-lid-right')&&markup.includes('yr-gaze'),'Expressive eye groups missing for '+outfit);
 const opens=(markup.match(/<g(?:\s|>)/g)||[]).length;
 const closes=(markup.match(/<\/g>/g)||[]).length;
 assert.equal(opens,closes,'Unbalanced SVG groups for '+outfit);
}
assert.ok(css.includes('yr-lid-on-demand') && css.includes('translateY(-72px)'), 'Natural eyelids should return to an open-eyed rest state');
console.log('A Whisker a Day v2.1: syntax, eyelids, embedded source, user data, offline and animation checks passed.');
