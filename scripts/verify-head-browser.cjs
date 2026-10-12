/* One real-browser regression check, no bundled browser dependency. */
'use strict';
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const exe=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
if(!exe){console.error('Headless Chrome/Chromium unavailable; do not claim browser QA passed.');process.exit(1);}
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((request,response)=>{
 const url=new URL(request.url,'http://localhost');
 let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!file.startsWith(root+path.sep)){response.writeHead(403).end();return;}
 fs.stat(file,(err,stat)=>{
  if(err||!stat.isFile()){response.writeHead(404).end();return;}
  response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(response);
 });
});
function launch(args){
 return new Promise((resolve,reject)=>{
  const p=spawn(exe,args,{stdio:['ignore','pipe','pipe']});
  let stdout='',stderr='',timedOut=false;
  const timer=setTimeout(()=>{timedOut=true;p.kill('SIGKILL');},30000);
  p.stdout.on('data',x=>{stdout+=String(x);});
  p.stderr.on('data',x=>{stderr+=String(x);});
  p.on('error',e=>{clearTimeout(timer);reject(e);});
  p.on('close',code=>{clearTimeout(timer);if(timedOut)reject(new Error('Chrome timed out'));else resolve({code,stdout,stderr});});
 });
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'whisker-browser-'));
 const url='http://127.0.0.1:'+server.address().port+'/tests/browser-rig.html';
 const flags=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--hide-scrollbars','--window-size=1000,940','--virtual-time-budget=4000','--user-data-dir='+dir];
 try{
  const result=await launch([...flags,'--dump-dom',url]);
  const match=result.stdout.match(/<output[^>]*id="qa-status"[^>]*>([\s\S]*?)<\/output>/);
  const status=match?.[0]||'Missing browser QA result element';
  if(result.code!==0||!/data-result="pass"/.test(status))throw new Error('Real browser head visibility failed: '+status.replace(/<[^>]*>/g,' ').slice(0,700)+' '+result.stderr.slice(-250));
  console.log('REAL BROWSER PASS: '+status.replace(/<[^>]*>/g,' ').trim());
  const artifacts=path.join(root,'artifacts');
  fs.mkdirSync(artifacts,{recursive:true});
  const screenshot=path.join(artifacts,'yarrow-head-visibility.png');
  const shot=await launch([...flags,'--screenshot='+screenshot,url]);
  if(shot.code!==0||!fs.existsSync(screenshot))throw new Error('Could not capture side/front screenshot');
  console.log('Rendered comparison saved to artifacts/yarrow-head-visibility.png');
 }finally{server.close();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;server.close();});
