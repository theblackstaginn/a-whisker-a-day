/* Static SVG pose inspection, NOT browser animation validation.
   Requires sharp (or CODEX_PRIMARY_RUNTIME_NODE_MODULES pointing to it).
   Usage: node scripts/render-rig-review.cjs /absolute/output.png */
const fs=require('fs'),path=require('path'),vm=require('vm');
const sharp=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES?path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'sharp'):'sharp');
const root=path.resolve(__dirname,'..');
(async()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'yarrow-cutout.js'),'utf8'),ctx);
 const atlas=await sharp(path.join(root,'assets/hearth-v24/yarrow-parts.webp')).png().toBuffer();
 const cases=[['Idle',{},'default',false],['Head tilt',{'head':'rotate(-4 220 349)'},'default',false],['Ears',{'ear-left':'rotate(-4 171 255)','ear-right':'rotate(2 272 255)'},'default',false],['Knead',{'paw-left':'translate(0 -6)'},'default',false],['Tail',{'tail':'rotate(-6 302 577)'},'default',false],['Blink',{},'default',true],['Hat + tilt',{'head':'rotate(-4 220 349)'},'hat',false],['Flowers + tilt',{'head':'rotate(-4 220 349)'},'flowers',false],['Offer',{'paw-right':'translate(0 -11)'},'default',false]];
 const cells=cases.map(([label,transforms,outfit,blink],i)=>{
  let svg=ctx.window.YarrowCutout.render({outfit}).match(/<svg[\s\S]*<\/svg>/)[0];
  for(const [part,transform]of Object.entries(transforms))svg=svg.replace('class="yr-painted-'+part+'"','class="yr-painted-'+part+'" transform="'+transform+'"');
  svg=svg.replaceAll('./assets/hearth-v24/yarrow-parts.webp','data:image/png;base64,'+atlas.toString('base64')).replace('<svg class=',`<svg x="${(i%3)*300}" y="${Math.floor(i/3)*470+30}" width="300" height="430" class=`);
  svg=svg.replace('class="yr-book-lids"',`class="yr-book-lids" opacity="${blink?1:0}"`);
  return `<text x="${(i%3)*300+15}" y="${Math.floor(i/3)*470+25}" font-family="sans-serif" font-size="18" fill="#302b22">${label}</text>`+svg;
 });
 const doc='<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1410"><rect width="900" height="1410" fill="#eddfc1"/>'+cells.join('')+'</svg>';
 await sharp(Buffer.from(doc)).png().toFile(process.argv[2]||'/tmp/whisker-rig-review.png');
})();
