/* Yarrow articulated familiar • animation lab v3.
   A joint-driven, continuous SVG character: no whole-image pose rotation, no data changes.
   Current painted atlas stays the face/ear identity source. Profile is a drawn master,
   pending matching painted side-view art review. Main app keeps its original fallback.
*/
(()=>{
'use strict';
const ATLAS='./assets/hearth-v24/yarrow-parts.webp';
const P={
  sit:{hip:[218,514],shoulder:[218,398],neck:[219,351],head:[218,271],tilt:0,side:0,width:[104,76],
    fl:[[168,406],[157,510],[158,607]],fr:[[268,405],[277,507],[278,607]],
    hl:[[151,504],[119,555],[123,608]],hr:[[285,506],[312,555],[316,607]],
    tail:[[310,514],[368,515],[395,565],[367,600],[331,604]]},
  crouch:{hip:[207,535],shoulder:[226,432],neck:[231,383],head:[228,301],tilt:-4,side:.05,width:[102,75],
    fl:[[179,435],[155,531],[157,610]],fr:[[270,434],[293,532],[299,610]],
    hl:[[140,527],[116,558],[124,609]],hr:[[290,529],[310,559],[317,608]],
    tail:[[314,528],[379,493],[402,544],[373,582],[343,593]]},
  stand:{hip:[145,464],shoulder:[283,449],neck:[310,402],head:[305,325],tilt:3,side:.94,width:[65,67],
    fl:[[257,469],[255,537],[248,609]],fr:[[302,471],[317,542],[328,608]],
    hl:[[115,484],[105,547],[111,607]],hr:[[165,489],[177,553],[179,608]],
    tail:[[84,458],[53,408],[72,350],[100,352],[112,378]]},
  stretch:{hip:[130,442],shoulder:[284,482],neck:[325,482],head:[328,408],tilt:-14,side:1,width:[70,60],
    fl:[[284,492],[276,556],[265,612]],fr:[[329,493],[340,553],[359,612]],
    hl:[[108,465],[103,553],[103,607]],hr:[[167,481],[167,557],[174,609]],
    tail:[[71,436],[45,356],[49,272],[74,234],[92,238]]},
  turn:{hip:[126,465],shoulder:[270,437],neck:[307,391],head:[309,316],tilt:1,side:1,width:[73,65],
    fl:[[253,453],[265,544],[258,607]],fr:[[292,453],[306,539],[310,606]],
    hl:[[94,477],[103,541],[101,606]],hr:[[158,481],[164,539],[170,607]],
    tail:[[69,464],[25,445],[19,398],[45,368],[72,383]]}
};
const RUNS={
 stand:[[0,'sit'],[.17,'crouch'],[.53,'stand'],[.77,'stand'],[1,'sit']],
 stretch:[[0,'sit'],[.15,'crouch'],[.37,'stand'],[.60,'stretch'],[.81,'stretch'],[1,'sit']],
 turn:[[0,'sit'],[.16,'crouch'],[.39,'stand'],[.66,'turn'],[.83,'turn'],[1,'sit']]
};
const DURATION={stand:3100,stretch:3800,turn:3600,blink:900,tilt:1500,purr:2200,knead:2750,offer:2000,swish:1400,happy:1550};
const known=['idle','blink','tilt','purr','knead','offer','swish','happy','stand','stretch','turn'];
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const ease=t=>{t=clamp(t);return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
function blend(a,b,t){
 const walk=(x,y)=>Array.isArray(x)?x.map((v,i)=>walk(v,y[i])):(x&&typeof x==='object')?Object.fromEntries(Object.keys(x).map(k=>[k,walk(x[k],y[k])])):typeof x==='number'?lerp(x,y,t):x;
 return walk(a,b);
}
const clone=o=>JSON.parse(JSON.stringify(o));
function sample(name,progress,origin){
 const list=RUNS[name];
 if(!list)return clone(P.sit);
 const u=clamp(progress);
 for(let i=1;i<list.length;i++){
   if(u<=list[i][0]){
     const [t0,p0]=list[i-1], [t1,p1]=list[i];
     return blend(i===1&&origin?origin:P[p0],P[p1],ease((u-t0)/(t1-t0)));
   }
 }
 return clone(P.sit);
}
const xy=(p)=>p[0].toFixed(1)+' '+p[1].toFixed(1);
const move=(p,x,y)=>[p[0]+x,p[1]+y];
function furBody(p){
 const h=p.hip,s=p.shoulder,dx=s[0]-h[0],dy=s[1]-h[1],len=Math.max(1,Math.hypot(dx,dy));
 const n=[-dy/len,dx/len], b=p.width[0],a=p.width[1];
 const plus=(point,m)=>[point[0]+n[0]*m,point[1]+n[1]*m];
 const hl=plus(h,b),hr=plus(h,-b),sl=plus(s,a),sr=plus(s,-a);
 const mid=[(h[0]+s[0])/2,(h[1]+s[1])/2];
 return 'M'+xy(hl)+' C'+xy(plus(mid,b*1.1))+' '+xy(plus(s,a*1.24))+' '+xy(sl)+
   ' Q'+xy(move(s,dx*.09,dy*.09))+' '+xy(sr)+
   ' C'+xy(plus(s,-a*1.25))+' '+xy(plus(mid,-b*1.06))+' '+xy(hr)+
   ' Q'+xy(move(h,-dx*.28,-dy*.28))+' '+xy(hl)+' Z';
}
function ruff(p){
 const s=p.shoulder, h=p.neck;
 const l=[s[0]-55,s[1]-7],r=[s[0]+58,s[1]-7];
 return 'M'+xy(l)+' Q'+xy(move(h,-36,14))+' '+xy(move(h,-23,-8))+
 ' Q'+xy(move(h,3,-4))+' '+xy(move(h,29,-4))+' Q'+xy(move(h,42,19))+' '+xy(r)+
 ' Q'+xy(move(s,18,65))+' '+xy(move(s,-16,57))+' Z';
}
function furMarks(p){
 const d=[p.shoulder[0]-p.hip[0],p.shoulder[1]-p.hip[1]],l=Math.max(1,Math.hypot(...d)),n=[-d[1]/l,d[0]/l];
 let out='';
 for(let i=0;i<48;i++){
   const t=(i*37%47+.5)/48,spread=(((i*13)%31)/31-.5)*1.36,
   center=[lerp(p.hip[0],p.shoulder[0],t),lerp(p.hip[1],p.shoulder[1],t)],
   rad=lerp(p.width[0],p.width[1],t);
   const x=center[0]+n[0]*rad*spread,y=center[1]+n[1]*rad*spread;
   const end=[x+d[0]/l*(4+i%8)+n[0]*(i%3-1)*3,y+d[1]/l*(4+i%8)+n[1]*(i%3-1)*3];
   out+='M'+x.toFixed(1)+' '+y.toFixed(1)+'L'+xy(end);
 }
 return out;
}
function bone(a,b,w0,w1){
 const d=[b[0]-a[0],b[1]-a[1]],l=Math.max(1,Math.hypot(...d)),n=[-d[1]/l,d[0]/l];
 const q=(p,w,side)=>[p[0]+n[0]*w*side,p[1]+n[1]*w*side];
 const m=[lerp(a[0],b[0],.48),lerp(a[1],b[1],.48)];
 return 'M'+xy(q(a,w0,1))+' Q'+xy(q(m,(w0+w1)*.56,1))+' '+xy(q(b,w1,1))+
 ' Q'+xy(move(b,d[0]/l*5,d[1]/l*5))+' '+xy(q(b,w1,-1))+
 ' Q'+xy(q(m,(w0+w1)*.56,-1))+' '+xy(q(a,w0,-1))+' Z';
}
function skeletonParts(id,back){
 const sh=back?'hind':'fore';
 return '<g class="ym-limb ym-'+id+'"><path data-part="'+id+'-top" class="ym-limb-coat"/>'+
 '<path data-part="'+id+'-bottom" class="ym-limb-coat"/>'+
 '<ellipse data-part="'+id+'-joint" class="ym-limb-joint" rx="'+(back?19:15)+'" ry="'+(back?17:14)+'"/>'+
 '<path data-part="'+id+'-shine" class="ym-limb-shine"/>'+
 '<g data-part="'+id+'-paw"><ellipse cx="0" cy="0" rx="'+(back?34:29)+'" ry="16" class="ym-paw-pad"/>'+
 '<path d="M-9 -10v18m14-18v18M-22 -2q10 7 19 6" stroke="#836448" stroke-width="2.4" opacity=".45" fill="none" stroke-linecap="round"/></g></g>';
}
function headwear(outfit){
 if(outfit==='flowers')return '<g class="ym-worn" data-attach="head"><path d="M-122-74Q0-125 120-77" stroke="#698062" stroke-width="8" fill="none"/><g fill="#eee0b4" stroke="#a37d48" stroke-width="2"><circle cx="-79" cy="-92" r="14"/><circle cx="-15" cy="-108" r="13"/><circle cx="50" cy="-100" r="13"/><circle cx="96" cy="-86" r="12"/></g><g fill="#dcad59"><circle cx="-79" cy="-92" r="5"/><circle cx="-15" cy="-108" r="5"/><circle cx="50" cy="-100" r="5"/><circle cx="96" cy="-86" r="5"/></g></g>';
 if(outfit==='hat')return '<g class="ym-worn" data-attach="head"><path d="M-101-90Q-50-180 22-208Q18-142 99-94Z" fill="#344f3d" stroke="#1e3027" stroke-width="5"/><path d="M-110-88Q-13-57 116-88L119-66Q-10-36-115-68Z" fill="#304837" stroke="#c9af72" stroke-width="5"/><path d="M-111-72Q9-43 116-74" stroke="#b29b66" stroke-width="5" fill="none"/></g>';
 if(outfit==='beret')return '<g class="ym-worn" data-attach="head"><path d="M-113-72Q-104-146-13-143Q74-157 119-78Q12-37-113-72Z" fill="#896776" stroke="#463744" stroke-width="5"/><path d="M-103-73Q9-42 110-78" stroke="#d2a6b0" stroke-width="7" fill="none"/></g>';
 return '';
}
function neckwear(outfit){
 if(outfit==='scarf')return '<g class="ym-worn" data-attach="neck"><path d="M-65-3Q0 20 64-5L71 19Q0 38-69 18Z" fill="#ac694d" stroke="#684337" stroke-width="4"/><g data-part="scarf-tail"><path d="M43 17Q73 51 74 105L55 114Q56 63 29 30Z" fill="#bd7254" stroke="#e9af83" stroke-width="3"/><path d="M55 110v13m9-13v15m9-18v15" stroke="#ebbe8e" stroke-width="2.5"/></g><path d="M-59 8Q0 29 59 6" stroke="#eed0a3" stroke-width="3" opacity=".7" fill="none"/></g>';
 if(outfit==='ribbon')return '<g class="ym-worn" data-attach="neck"><path d="M-67 4Q0 26 64 3" stroke="#9bb391" stroke-width="11" fill="none"/><path d="M41 13q-19-20-31-1 9 20 33 5 18-20 31-3-3 24-28 7" fill="#9fb796" stroke="#587258" stroke-width="3"/></g>';
 if(outfit==='star')return '<g class="ym-worn" data-attach="neck"><path d="M-67 5Q0 27 65 5" stroke="#6b8182" stroke-width="10" fill="none"/><path d="M0 20l7 13 15 3-11 11 3 17-14-8-14 8 3-17-11-11 15-3Z" fill="#e4c884" stroke="#a4824f" stroke-width="2"/></g>';
 if(outfit==='acorn')return '<g class="ym-worn" data-attach="neck"><path d="M-64 5Q0 26 66 4" stroke="#afa279" stroke-width="10" fill="none"/><path d="M0 20Q21 21 18 42Q16 60 0 64Q-17 55-18 40Q-20 21 0 20Z" fill="#a77a50" stroke="#665339" stroke-width="3"/><path d="M-17 32Q0 23 17 32" stroke="#e1bd81" stroke-width="7"/></g>';
 return '';
}
function bodywear(outfit){
 if(outfit==='satchel')return '<g data-part="body-wear" class="ym-worn"><path d="M-50-59Q9-25 66 71" fill="none" stroke="#c3a476" stroke-width="8"/><path d="M54 61Q83 50 93 72L91 121Q65 134 49 116Z" fill="#78603f" stroke="#dec28b" stroke-width="4"/><path d="M51 71q18-16 42 2l-14 21-28-8Z" fill="#9b8154" stroke="#c9a87c" stroke-width="2"/></g>';
 if(outfit==='cape')return '<g data-part="body-wear" class="ym-worn"><path d="M-50-78Q-98-21-110 94Q-2 139 98 91Q92-18 50-80L24-49Q55 34 66 67Q0 96-72 67Q-58-7-25-51Z" fill="#475b49" stroke="#adc095" stroke-width="5" opacity=".93"/></g>';
 return '';
}
function face(){
 const img=(box,x,y,w,h)=>'<svg x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" viewBox="'+box+'" preserveAspectRatio="none" overflow="hidden"><image href="'+ATLAS+'" width="1536" height="1024"/></svg>';
 return '<g data-part="front-face">'+
 '<g data-part="ear-left">'+img('575 20 380 460',-133,-182,124,196)+'</g>'+
 '<g data-part="ear-right">'+img('1120 20 416 460',9,-187,134,198)+'</g>'+
 img('0 0 560 480',-165,-116,330,233)+
 '<g data-part="lids" class="ym-lids"><path d="M-76-9Q-53-24-28-7L-31 14Q-54 26-73 11Z" fill="#231b17"/><path d="M37-8Q60-23 84-5L81 15Q60 27 39 10Z" fill="#211914"/><path d="M-71 4Q-53 12-32 4M40 4Q61 12 81 3" stroke="#9b714e" fill="none" stroke-width="2"/></g></g>'+
 '<g data-part="profile-face" opacity="0">'+
 '<g class="ym-profile-ears"><path d="M-78-75Q-92-133-60-181Q-22-168-15-108Z" fill="#241a17" stroke="#110f0e" stroke-width="6"/><path d="M-68-112Q-68-146-53-161Q-32-148-28-118Z" fill="#97654b" stroke="#473026" stroke-width="4"/><path d="M-11-93Q0-155 51-187Q65-124 41-90Z" fill="#291e19" stroke="#14100f" stroke-width="6"/><path d="M4-104Q13-145 42-168Q49-133 36-104Z" fill="#a16d55" stroke="#624230" stroke-width="3"/><path d="M12-117q15-19 24-26M-58-128l8-15" fill="none" stroke="#d7a07e" stroke-width="3" opacity=".55"/></g>'+
 '<path d="M-95-60Q-89-100-45-110Q-5-137 35-92Q76-89 85-46Q87-20 114-12Q130-4 108 10Q97 44 66 61Q27 99-23 76Q-71 83-100 32Q-121-17-95-60Z" fill="url(#ym-fur)" stroke="#1b1512" stroke-width="5"/>'+
 '<path d="M79-4q18-9 32 3l-16 13Z" fill="#8a6251" stroke="#2c211b" stroke-width="2"/>'+
 '<path d="M94 13Q85 33 67 36" fill="none" stroke="#ba8c6a" stroke-width="3"/>'+
 '<ellipse cx="44" cy="-36" rx="25" ry="31" fill="url(#ym-eye)" stroke="#181411" stroke-width="5"/>'+
 '<ellipse cx="51" cy="-33" rx="9" ry="22" fill="#1d1713"/><circle cx="37" cy="-46" r="7" fill="#ffeebd"/>'+
 '<path d="M69 13q33-9 69-4M66 24q41 5 73 23M65 35q28 25 40 42" stroke="#c9a27b" stroke-width="2" fill="none" stroke-linecap="round"/>'+
 '<path d="M-97-17q-15 37 1 60m15-109q-22 44-21 64" stroke="#ae855c" opacity=".26" stroke-width="3" fill="none"/>'+
 '<path d="M-79-51l11 8m-18 6 9 8m-15 6 11 10m-9 11 12 5m-4 22 15 4m-15 18 12 9m12 22 13 4M-22-88l9 12m8-6 6 10m10-6 8 12m48 20 12 9m-9 24 12 8m-18 17 10 10m-19 20 8 10" stroke="#b08b67" stroke-width="3" opacity=".3" fill="none" stroke-linecap="round"/>'+
 '<g data-part="profile-lid" opacity="0"><path d="M19-34Q45-58 69-34Q54-12 20-33Z" fill="#211814"/><path d="M25-30Q45-25 65-33" stroke="#8b674a" stroke-width="2" fill="none"/></g>'+
 '</g>';
}
function makeSvg(outfit){
 let markup='<svg class="ym-svg" viewBox="0 0 440 700" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+
 '<defs><linearGradient id="ym-fur" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#3b2c23"/><stop offset=".48" stop-color="#241c19"/><stop offset="1" stop-color="#171412"/></linearGradient>'+
 '<radialGradient id="ym-eye"><stop stop-color="#fff1ae"/><stop offset=".48" stop-color="#f4b83c"/><stop offset="1" stop-color="#bd7624"/></radialGradient>'+
 '<linearGradient id="ym-gold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff2b6"/><stop offset=".5" stop-color="#efc35d"/><stop offset="1" stop-color="#99702e"/></linearGradient>'+
 '</defs>'+
 '<ellipse data-part="ground" cx="218" cy="624" rx="148" ry="16" fill="#221914" opacity=".27"/>'+
 '<g data-part="cape-back"></g>'+
 '<g class="ym-tail"><path data-part="tail-base" class="ym-tail-seg" stroke-width="35"/><path data-part="tail-1" class="ym-tail-seg" stroke-width="32"/><path data-part="tail-2" class="ym-tail-seg" stroke-width="27"/><path data-part="tail-tip" class="ym-tail-seg" stroke-width="20"/></g>'+
 skeletonParts('hl',true)+skeletonParts('hr',true)+
 '<path data-part="torso" fill="url(#ym-fur)" stroke="#1a1512" stroke-width="5"/>'+
 '<path data-part="fur-texture" stroke="#a87b58" stroke-width="2" fill="none" stroke-linecap="round" opacity=".28"/>'+
 '<path data-part="ruff" fill="#302620" stroke="#1a1613" stroke-width="3"/>'+
 skeletonParts('fl',false)+skeletonParts('fr',false)+
 '<g data-part="body-ornament">'+bodywear(outfit)+'</g>'+
 '<g data-part="collar"><path d="M-72-3Q0 22 72-3L65 16Q0 34-65 16Z" fill="#8e9d77" stroke="#516047" stroke-width="4"/><path d="M-60 6Q0 23 61 6" fill="none" stroke="#d6cb9d" stroke-width="3" opacity=".75"/><path d="M47 7Q65-3 82 11Q71 29 54 27Z" fill="#9ba781" stroke="#566447" stroke-width="3"/><path d="M58 18L68 70L85 57L97 65L81 23" fill="#80976b" stroke="#516746" stroke-width="3"/></g>'+
 '<g data-part="neck-ornament">'+neckwear(outfit)+'</g>'+
 '<g data-part="charm"><path d="M0-5V15" stroke="#a77d42" stroke-width="5" stroke-linecap="round"/><circle cy="12" r="5" fill="#d2b16a"/><path d="M7 22a20 20 0 1 0 22 29 23 23 0 1 1-22-29Z" fill="url(#ym-gold)" stroke="#946832" stroke-width="2.4"/></g>'+
 '<g data-part="head">'+face()+headwear(outfit)+'</g>'+
 '<g data-part="glints" opacity="0" stroke="#f6d38a" stroke-width="3"><path d="M94 398v17m-8-9h16M353 396v17m-8-9h16"/></g>'+
 '</svg>';
 // An authored static seated image ships in the markup itself. Reduced-motion
 // viewers and first paints never see an empty rig waiting for animation ticks.
 const p=P.sit;
 function bake(id,key,value){
   const match='data-part="'+id+'"';
   if(!markup.includes(match))throw Error('Missing rig layer: '+id);
   markup=markup.replace(match,match+' '+key+'="'+value+'"');
 }
 bake('torso','d',furBody(p));
 bake('ruff','d',ruff(p));
 bake('fur-texture','d',furMarks(p));
 bake('head','transform','translate('+xy(p.head)+')');
 bake('collar','transform','translate('+xy(p.neck)+')');
 bake('neck-ornament','transform','translate('+xy(p.neck)+')');
 bake('charm','transform','translate('+xy(move(p.neck,0,22))+')');
 bake('body-ornament','transform','translate('+xy([p.hip[0]*.4+p.shoulder[0]*.6,p.hip[1]*.4+p.shoulder[1]*.6])+')');
 for(const id of ['fl','fr','hl','hr']){
   const [a,b,c]=p[id],hind=id[0]==='h';
   bake(id+'-top','d',bone(a,b,hind?27:22,hind?22:18));
   bake(id+'-bottom','d',bone(b,c,hind?22:18,hind?15:13));
   bake(id+'-joint','cx',b[0]);
   bake(id+'-joint','cy',b[1]);
   bake(id+'-paw','transform','translate('+xy(c)+')');
   bake(id+'-shine','d','M'+xy(move(a,6,-2))+'Q'+xy(move(b,-1,-5))+' '+xy(move(c,-5,-12)));
 }
 for(let i=0;i<4;i++){
   const id=i===0?'tail-base':i===3?'tail-tip':'tail-'+i;
   bake(id,'d','M'+xy(p.tail[i])+'Q'+xy([(p.tail[i][0]+p.tail[i+1][0])/2+4,(p.tail[i][1]+p.tail[i+1][1])/2-6])+' '+xy(p.tail[i+1]));
 }
 return markup;
}
function render({place='hearth',outfit='default',sleepy=false,comforting=false}={}){
 const name=place==='hearth'?'Pet Yarrow, your black cat familiar':'Pet Yarrow in her cozy nook';
 return '<button type="button" class="yarrow-puppet cutout-yarrow storybook-yarrow manga-yarrow '+(place==='hearth'?'hearth-character':'profile-character')+' '+(sleepy?'is-nighttime ':'')+(comforting?'is-comforting':'')+'" data-pose="idle" data-action="pet-yarrow" aria-label="'+name+'" title="Give Yarrow a gentle pet">'+makeSvg(outfit)+'<span class="yarrow-touch-glint" aria-hidden="true"></span></button>';
}
function paint(puppet,p,now=0,action='idle',phase=0,offerSide='right'){
 if(!puppet.querySelector)return;
 const root=puppet.querySelector('.ym-svg');if(!root)return;
 const el=(id)=>root.querySelector('[data-part="'+id+'"]');
 const attr=(id,k,v)=>{const n=el(id);if(n)n.setAttribute(k,v);};
 const time=now*.001,sway=Math.sin(time*1.4),breath=Math.sin(time*1.25);
 const state=clone(p),living=action==='idle';
 if(living){state.shoulder[1]-=breath*1.5;state.neck[1]-=breath*1.5;state.head[1]-=breath*.7;state.tail[3][0]+=sway*4;state.tail[4][0]+=sway*7;}
 if(action==='tilt')state.tilt-=12*Math.sin(Math.PI*phase);
 if(action==='purr'){state.head[1]+=2.3*Math.sin(phase*Math.PI*6);state.tilt-=2.5*Math.sin(phase*Math.PI*4);}
 if(action==='knead'||action==='offer'){
   for(const id of ['fl','fr']){
     if(action==='offer'&&id!==(offerSide==='left'?'fl':'fr'))continue;
     const f=action==='knead'?Math.max(0,Math.sin(phase*Math.PI*6+(id==='fl'?0:Math.PI))):Math.sin(Math.PI*phase);
     state[id][1][1]-=f*21;state[id][2][1]-=f*(action==='offer'?72:22);
   }
 }
 if(action==='happy'){state.head[1]-=Math.sin(Math.PI*phase)*15;state.tail[4][1]-=12*Math.sin(Math.PI*phase);}
 if(action==='swish')state.tail[4][0]+=35*Math.sin(Math.PI*phase*2);
 if(action==='blink'||action==='purr')attr('lids','opacity',(Math.sin(Math.PI*phase*(action==='blink'?1:5))>.70)?'1':'0');
 else attr('lids','opacity',(Math.sin(time*1.4+1.4)>.9991)?'1':'0');
 attr('profile-lid','opacity',(action==='blink'&&Math.sin(phase*Math.PI)>.70)?'1':'0');
 attr('ground','rx',String(145+(state.hip[1]-514)*.16));
 const body=furBody(state);
 attr('torso','d',body);attr('ruff','d',ruff(state));attr('fur-texture','d',furMarks(state));
 for(const key of ['hl','hr','fl','fr']){
   const [a,b,c]=state[key],hind=key[0]==='h';
   attr(key+'-top','d',bone(a,b,hind?27:22,hind?22:18));
   attr(key+'-bottom','d',bone(b,c,hind?22:18,hind?15:13));
   attr(key+'-joint','cx',b[0].toFixed(1));attr(key+'-joint','cy',b[1].toFixed(1));
   attr(key+'-paw','transform','translate('+xy(c)+')');
   attr(key+'-shine','d','M'+xy(move(a,6,-2))+'Q'+xy(move(b,-1,-5))+' '+xy(move(c,-5,-12)));
 }
 for(let i=0;i<4;i++)attr(i===0?'tail-base':i===3?'tail-tip':'tail-'+i,'d','M'+xy(state.tail[i])+'Q'+xy([(state.tail[i][0]+state.tail[i+1][0])/2+4,(state.tail[i][1]+state.tail[i+1][1])/2-6])+' '+xy(state.tail[i+1]));
 const head=state.head;attr('head','transform','translate('+xy(head)+') rotate('+(state.tilt+Math.sin(time*1.8)*.6).toFixed(2)+')');
 attr('front-face','opacity',(1-clamp(state.side*1.22)).toFixed(3));
 attr('profile-face','opacity',clamp((state.side-.15)/.85).toFixed(3));
 const earl=[lerp(-73,-25,state.side),lerp(-86,-102,state.side)];
 const earr=[lerp(69,18,state.side),lerp(-86,-116,state.side)];
 attr('ear-left','transform','translate('+xy(earl)+') rotate('+(Math.sin(time*1.3)*2.5).toFixed(2)+') translate(73 86)');
 attr('ear-right','transform','translate('+xy(earr)+') rotate('+(Math.sin(time*.91+2)*3.2).toFixed(2)+') translate(-69 86)');
 const neck=state.neck,dx=state.shoulder[0]-neck[0],dy=state.shoulder[1]-neck[1];
 const collarAngle=Math.atan2(dx,dy)*180/Math.PI;
 attr('collar','transform','translate('+xy(neck)+') rotate('+collarAngle.toFixed(2)+')');
 attr('neck-ornament','transform','translate('+xy(move(neck,0,1))+') rotate('+collarAngle.toFixed(2)+')');
 attr('charm','transform','translate('+xy(move(neck,0,22))+') rotate('+(Math.sin(time*2-1.1)*4-(state.tilt*.32)).toFixed(2)+')');
 attr('scarf-tail','transform','rotate('+(Math.sin(time*1.6-1)*3).toFixed(2)+' 49 18)');
 const torsoAngle=Math.atan2(state.shoulder[1]-state.hip[1],state.shoulder[0]-state.hip[0])*180/Math.PI+90;
 attr('body-ornament','transform','translate('+xy([lerp(state.hip[0],state.shoulder[0],.6),lerp(state.hip[1],state.shoulder[1],.6)])+') rotate('+(torsoAngle*.6).toFixed(1)+')');
 attr('glints','opacity',(action==='happy'||action==='purr')?String(Math.max(0,Math.sin(phase*Math.PI*4)*.7)):'0');
}
function mount(puppet){
 if(!puppet)return null;
 let timeout=0,raf=0,started=0,duration=0,origin=null,last=clone(P.sit),offerSide='right';
 let action='idle',ended=false,disposed=false;
 const doc=typeof document!=='undefined'?document:null;
 const controls=doc?Array.from(doc.querySelectorAll('[data-yarrow-motion]')):[];
 const listeners=[];
 const reduce=()=>!!((doc?.body?.classList?.contains('motion-off'))||(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches));
 const scene={ready:true,action:'idle',offerSide,dispose(){
   disposed=true;clearTimeout(timeout);window.cancelAnimationFrame?.(raf);
   for(const [button,handler] of listeners)button.removeEventListener('click',handler);
   doc?.removeEventListener?.('visibilitychange',onVisibility);
 },pose(name,ms){
   if(!puppet.isConnected||!known.includes(name))return false;
   clearTimeout(timeout);action=name;scene.action=name;origin=clone(last);
   started=window.performance?.now?.()??Date.now();duration=Math.max(500,ms||DURATION[name]||1400);
   if(name==='offer'){offerSide=offerSide==='right'?'left':'right';scene.offerSide=offerSide;puppet.dataset.side=offerSide;}
   if(puppet.dataset.pose===name){puppet.dataset.pose='idle';void puppet.offsetWidth;}
   puppet.dataset.pose=name;
   if(name!=='idle')timeout=setTimeout(()=>{if(puppet.isConnected){puppet.dataset.pose='idle';scene.action='idle';action='idle';origin=null;}},duration);
   if(!raf&&!reduce()&&!doc?.hidden&&window.requestAnimationFrame)raf=window.requestAnimationFrame(tick);
   return true;
 }};
 function tick(t){
   raf=0;if(disposed||!puppet.isConnected)return;
   if(reduce()){paint(puppet,P.sit,0);return;}
   if(doc?.hidden)return;
   const progress=action==='idle'?0:clamp((t-started)/duration);
   const pose=RUNS[action]?sample(action,progress,origin):clone(P.sit);
   last=pose;paint(puppet,pose,t,action,progress,offerSide);
   raf=window.requestAnimationFrame(tick);
 }
 function onVisibility(){if(!doc?.hidden&&!raf&&!reduce()&&window.requestAnimationFrame)raf=window.requestAnimationFrame(tick);}
 for(const b of controls){const fn=()=>scene.pose(b.dataset.yarrowMotion);b.addEventListener('click',fn);listeners.push([b,fn]);}
 doc?.addEventListener?.('visibilitychange',onVisibility);
 if(!reduce()&&window.requestAnimationFrame){raf=window.requestAnimationFrame(tick);}else paint(puppet,P.sit,0);
 return scene;
}
window.YarrowMangaRig=Object.freeze({masterPoses:P,poseTimelines:RUNS,sample,blend,makeSvg,paint,version:'3.0.0-rig-lab'});
window.YarrowCutout=Object.freeze({render,mount,version:'3.0.0-rig-lab'});
})();