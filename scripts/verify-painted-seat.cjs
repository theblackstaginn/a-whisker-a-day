/* Real Chromium source/asset/render QA for painted seated Yarrow.
   This has NO ability to read or modify personal application state. */
'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const {spawn}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const exe=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'].find(fs.existsSync);
if(!exe){console.error('Chrome or Chromium is required; browser QA cannot be claimed without it.');process.exit(1);}
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png'};
const server=http.createServer((req,res)=>{
 let url;
 try{url=new URL(req.url,'http://localhost');}catch{res.writeHead(400).end();return;}
 const filename=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(!filename.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.stat(filename,(err,stat)=>{
   if(err||!stat.isFile()){res.writeHead(404).end();return;}
   res.writeHead(200,{'content-type':mime[path.extname(filename)]||'application/octet-stream','content-length':stat.size,'cache-control':'no-store'});
   fs.createReadStream(filename).pipe(res);
 });
});
function chrome(args){
 return new Promise((resolve,reject)=>{
   const process=spawn(exe,args,{stdio:['ignore','pipe','pipe']});
   let stdout='',stderr='';
   const timeout=setTimeout(()=>process.kill('SIGKILL'),23000);
   process.stdout.on('data',chunk=>{stdout+=String(chunk);});
   process.stderr.on('data',chunk=>{stderr+=String(chunk);});
   process.on('error',err=>{clearTimeout(timeout);reject(err);});
   process.on('close',code=>{clearTimeout(timeout);resolve({code,stdout,stderr});});
 });
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'yarrow-seat-'));
 const flags=['--headless=new','--no-sandbox','--disable-dev-shm-usage','--no-first-run','--disable-background-networking','--hide-scrollbars','--virtual-time-budget=5000','--user-data-dir='+dir];
 const output=path.join(root,'artifacts');
 fs.mkdirSync(output,{recursive:true});
 try{
    const check=await chrome([...flags,'--window-size=950,950','--dump-dom','http://127.0.0.1:'+port+'/yarrow-painted-seat.html?qa=1']);
    const status=check.stdout.match(/<output[^>]*id="qa-result"[^>]*>[\s\S]*?<\/output>/)?.[0]||'No browser QA output';
    if(check.code!==0||!status.includes('data-qa="pass"'))throw Error('Painted seated browser check failed: '+status.replace(/<[^>]*>/g,' ')+check.stderr.slice(-400));
    console.log('REAL CHROME ART QA: '+status.replace(/<[^>]*>/g,' ').trim());
    for(const width of [320,375,390,430]){
      const file=path.join(output,'painted-seat-'+width+'px.png');
      const capture=await chrome([...flags,'--window-size='+width+',1000','--screenshot='+file,'http://127.0.0.1:'+port+'/yarrow-painted-seat.html']);
      if(capture.code!==0||!fs.existsSync(file))throw Error('Could not capture '+width+'px painted Yarrow layout');
      console.log('Yarrow painted art at '+width+' CSS pixels: '+path.basename(file));
    }
    for(const outfit of ['scarf','hat','cape']){
      const file=path.join(output,'painted-seat-'+outfit+'.png');
      const capture=await chrome([...flags,'--window-size=390,1000','--screenshot='+file,'http://127.0.0.1:'+port+'/yarrow-painted-seat.html?outfit='+outfit]);
      if(capture.code!==0||!fs.existsSync(file))throw Error('Could not capture '+outfit+' painted attachment');
      console.log('Wardrobe attachment: '+path.basename(file));
    }
 }finally{server.close();fs.rmSync(dir,{recursive:true,force:true});}
})().catch(err=>{console.error(err.stack||err);process.exitCode=1;server.close();});
