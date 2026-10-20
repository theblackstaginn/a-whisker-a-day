import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../yarrow-cutout.js',import.meta.url),'utf8');
let next=0;const timers=new Map();const context={window:{},setTimeout(fn){timers.set(++next,fn);return next;},clearTimeout(id){timers.delete(id);}};
vm.runInNewContext(source,context);
const rig=context.window.YarrowCutout;
const puppet={isConnected:true,dataset:{},offsetWidth:100};
const controller=rig.mount(puppet);
for(const action of ['blink','tilt','purr','knead','swish','happy']){
 assert.equal(controller.pose(action,1400),true);assert.equal(puppet.dataset.pose,action);assert.equal(timers.size,1);
 controller.pose(action,1400);assert.equal(timers.size,1,'Repeat taps replace the pending reset');
 const fn=[...timers.values()][0];timers.clear();fn();assert.equal(puppet.dataset.pose,'idle');
}
controller.pose('offer');const first=puppet.dataset.side;controller.pose('offer');assert.notEqual(puppet.dataset.side,first);
controller.dispose();assert.equal(timers.size,0,'Navigating away releases pending reset');
puppet.isConnected=false;assert.equal(controller.pose('purr'),false);
const markup=rig.render();
assert.ok(markup.includes('yr-life-render'),'Default Yarrow should render the final pose stack');
assert.ok(markup.includes('yarrow-sitting.webp'),'Sitting pose should use the final Work render');
const wardrobeMarkup=rig.render({outfit:'hat'});
for(const part of ['head','ear-left','ear-right','paw-left','paw-right','tail'])assert.ok(wardrobeMarkup.includes('yr-painted-'+part));
const css=fs.readFileSync(new URL('../yarrow-cutout.css',import.meta.url),'utf8');
assert.ok(css.includes('body.motion-off .storybook-yarrow .yr-storybook-svg *{animation:none!important'));
assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
assert.ok(css.includes('@keyframes yr-painted-breathe'), 'Painted Yarrow keeps visible breathing motion');
assert.ok(css.includes('transform:rotate(-12deg)'), 'Tail swish remains visible at phone size');
assert.ok(css.includes('yr-book-blink-now 1.35s'), 'Slow blink is long enough to read visually');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.ok(index.includes("},7600);"), 'Ambient familiar gesture cadence is under eight seconds');
assert.ok(index.includes("Your device Reduce Motion setting is keeping Yarrow still."), 'Blocked motion explains the device setting');
assert.ok(index.includes("setupYarrowScene();if(state.animation)"), 'Turning motion back on remounts the familiar controller');
assert.ok(index.includes("window.__whiskerVersion = '2.5.0-dev';"));
assert.ok(source.includes("version:'2.6.0-dev'"),'Final pose rig version should be current');
const sw=fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8');
for(const file of ['apothecary','yarrow-parts']){
 assert.ok(sw.includes('./assets/hearth-v24/'+file+'.webp'));
 const asset=fs.readFileSync(new URL('../assets/hearth-v24/'+file+'.webp',import.meta.url));assert.equal(asset.toString('ascii',8,12),'WEBP');
}
for(const file of ['yarrow-sitting','yarrow-sitting-blink','yarrow-standing','yarrow-standing-blink','yarrow-sleeping']){
 const asset=fs.readFileSync(new URL('../assets/yarrow-life/'+file+'.webp',import.meta.url));
 assert.equal(asset.toString('ascii',0,4),'RIFF');
}
assert.ok(css.includes('yr-life-ear-left'),'Final raster pose keeps ear movement isolated to an ear overlay');
assert.ok(css.includes('yr-life-sleep-breathe'),'Sleeping render keeps slow breathing');
console.log('Rig controller lifecycle and final Yarrow asset wiring passed. This does not verify browser animation or compositing.');
