import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const src=fs.readFileSync(new URL('../yarrow-manga-rig.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../yarrow-manga-rig.css',import.meta.url),'utf8');
const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
new vm.Script(src,{filename:'yarrow-manga-rig.js'});
const rafs=new Map(), timers=new Map(), listeners=new Map();
let next=0,clock=0,motionOff=false,hidden=false;
const attributes=new Map();
const fakeRoot={querySelector(selector){
 if(!attributes.has(selector))attributes.set(selector,new Map());
 return {setAttribute(key,value){attributes.get(selector).set(key,String(value));}};
}};
const doc={
 querySelectorAll(){return [];},
 body:{classList:{contains(name){return name==='motion-off'&&motionOff;}}},
 addEventListener(event,cb){listeners.set(event,cb);},
 removeEventListener(event){listeners.delete(event);},
 get hidden(){return hidden;}
};
const win={
 performance:{now(){return clock;}},
 requestAnimationFrame(cb){const id=++next;rafs.set(id,cb);return id;},
 cancelAnimationFrame(id){rafs.delete(id);},
 matchMedia(){return {matches:false};}
};
const ctx={
 window:win,document:doc,
 setTimeout(cb){const id=++next;timers.set(id,cb);return id;},
 clearTimeout(id){timers.delete(id);}
};
vm.runInNewContext(src,ctx,{timeout:3000});
const rig=win.YarrowMangaRig, puppet=win.YarrowCutout;
assert.equal(rig.version,'3.0.0-rig-lab');
assert.equal(puppet.version,rig.version);
for(const name of ['sit','crouch','stand','stretch','turn']){
 const p=rig.masterPoses[name];
 assert.ok(p&&p.hip&&p.neck&&p.head&&p.tail,'Missing distinct master '+name);
 for(const leg of ['fl','fr','hl','hr'])assert.equal(p[leg].length,3,'Three independent limb joints required for '+leg);
 assert.equal(p.tail.length,5,'Tail must have five linked nodes');
}
const sit=rig.masterPoses.sit, standing=rig.masterPoses.stand;
assert.notDeepEqual(Array.from(standing.hip),Array.from(sit.hip),'Standing must change anatomical master points');
const halfway=rig.sample('stand',.36);
assert.notEqual(halfway.hip[0],sit.hip[0],'Interpolated pose must move hip geometry');
assert.ok(halfway.fl[1][0]!==sit.fl[1][0],'Foreleg elbow must move');
assert.ok(rig.sample('stretch',.64).head[0]>rig.sample('stand',.64).head[0],'Stretch needs a distinct forward head pose');
assert.equal(rig.sample('turn',1).hip[0],sit.hip[0],'Motion must return to seated master');
assert.ok(rig.sample('turn',.7).side>.9,'Turn is a real side facing master, not squashed front art');
for(const name of ['stand','stretch','turn']){
 const keys=rig.poseTimelines[name];assert.ok(keys.length>=5,'Key poses required for '+name);
 assert.equal(keys[0][0],0);assert.equal(keys[keys.length-1][0],1);
}
for(const outfit of ['default','hat','flowers','beret','scarf','satchel','cape','ribbon','star','acorn']){
 const svg=rig.makeSvg(outfit);
 assert.ok(svg.includes('viewBox="0 0 440 700"'));
 assert.equal((svg.match(/<g\b/g)||[]).length,(svg.match(/<\/g>/g)||[]).length,'SVG groups must balance: '+outfit);
 for(const id of ['torso','ruff','head','collar','charm','tail-base','tail-1','tail-2','tail-tip','fl-top','fl-bottom','fr-top','fr-bottom','hl-top','hl-bottom','hr-top','hr-bottom'])assert.ok(svg.includes('data-part="'+id+'"'),id+' missing');
 if(outfit==='hat'||outfit==='flowers'||outfit==='beret')assert.ok(svg.includes('data-attach="head"'),outfit+' follows head');
 if(outfit==='scarf'||outfit==='ribbon'||outfit==='star'||outfit==='acorn')assert.ok(svg.includes('data-attach="neck"'),outfit+' follows neck');
 if(outfit==='satchel'||outfit==='cape')assert.ok(svg.includes('data-part="body-wear"'),outfit+' follows torso');
}
assert.ok(index.indexOf('yarrow-manga-rig.js')>index.indexOf('/* Editable in yarrow-cutout.js'));
assert.ok(index.indexOf('yarrow-manga-rig.js')<index.indexOf('const STORAGE_KEY ='));
assert.ok(css.includes('.manga-yarrow .ym-svg'),'Experimental styling scoped to new renderer');
assert.ok(css.includes('prefers-reduced-motion')&&css.includes('body.motion-off'),'Accessibility controls retained');
for(const layer of ['lids','profile-face','glints']){
 assert.ok(!css.includes('[data-part="'+layer+'"]{opacity:0}'),
  'Do not force SVG animation layer '+layer+' permanently invisible through CSS');
}
assert.ok(index.includes('rig-headfix2'),'iPhone preview stylesheet must invalidate the previous broken CSS cache');
assert.ok(!src.includes('localStorage'),'Rig cannot touch journal or saved progress');
const livePuppet={isConnected:true,dataset:{pose:'idle'},querySelector(selector){return selector==='.ym-svg'?fakeRoot:null;},offsetWidth:1};
const scene=puppet.mount(livePuppet);
assert.equal(scene.ready,true);
function frame(timestamp){assert.ok(rafs.size,'Missing frame');const [id,cb]=rafs.entries().next().value;rafs.delete(id);clock=timestamp;cb(timestamp);}
const val=(part,attr)=>attributes.get('[data-part="'+part+'"]')?.get(attr);
frame(0);
const seatedPath=val('torso','d');
assert.ok(seatedPath?.startsWith('M'));
assert.equal(scene.pose('stand',3100),true);
frame(400);
const anticipation=val('torso','d');
frame(1750);
const upright=val('torso','d');
assert.notEqual(anticipation,upright,'Anatomical keyframes must actually animate');
assert.notEqual(seatedPath,upright,'Standing must redraw the torso silhouette');
assert.ok(Number(val('profile-face','opacity'))>.1,'Side geometry must become visible');
assert.ok(val('fl-top','d').startsWith('M'),'Independent front upper arm must render');
const poseAtStand=val('head','transform');
assert.ok(poseAtStand.includes('translate('),'Head should have an independent joint transform');
assert.equal(scene.pose('stretch',3800),true);
frame(3600);
const stretchTorso=val('torso','d');
assert.notEqual(stretchTorso,upright,'Stretch needs distinct body geometry');
assert.equal(scene.pose('turn',3600),true);
frame(5600);
assert.ok(Number(val('profile-face','opacity'))>.5,'True profile geometry must show on turn');
motionOff=true;
frame(5800);
assert.equal(rafs.size,0,'Motion off must pause expensive rendering');
assert.equal(val('torso','d'),seatedPath,'Motion off must restore a stable seated pose');
motionOff=false;hidden=false;
listeners.get('visibilitychange')();
assert.equal(rafs.size,1,'Visibility resumption must restart rig');
hidden=true;frame(5900);assert.equal(rafs.size,0,'Hidden document should suspend animation');
scene.dispose();
assert.equal(timers.size,0,'Disposing scene must clear reset timers');
assert.equal(listeners.has('visibilitychange'),false,'Unmount must remove document listeners');
console.log('Articulated master geometry, interpolation, live motion, wardrobe anchors, and reduced-motion lifecycle passed. Visual iPhone QA still required.');
