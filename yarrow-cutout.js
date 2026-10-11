/* Yarrow Inked Storybook Familiar • v2.1
   A single authored character: separate SVG anatomy, never full-photo switching.
   No subscriptions, network requests, tracking, timers per frame, or third-party assets.
*/
(()=>{
  'use strict';
  const whisker = '#c4a586';
  const detail = (path)=>`<path d="${path}" stroke="#aa815e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".37"/>`;
  function accessories(outfit){
    if(outfit==='flowers')return `<g class="yr-extra" aria-hidden="true" transform="translate(190 108)"><path d="M-67 4Q0-32 76-1" stroke="#77885e" fill="none" stroke-width="6"/><g fill="#f9e9c7" stroke="#c9ae78" stroke-width="1.5"><ellipse rx="11" ry="6" transform="translate(-45 -7) rotate(20)"/><ellipse rx="11" ry="6" transform="translate(-12 -15) rotate(50)"/><ellipse rx="11" ry="6" transform="translate(22 -16) rotate(-20)"/><ellipse rx="11" ry="6" transform="translate(54 -5) rotate(35)"/></g><g fill="#efb843"><circle cx="-45" cy="-7" r="4"/><circle cx="-12" cy="-15" r="4"/><circle cx="22" cy="-16" r="4"/><circle cx="54" cy="-5" r="4"/></g></g>`;
    if(outfit==='hat')return `<g class="yr-extra"><path d="M134 137Q178 58 220 18Q224 94 267 135Q207 116 134 137Z" fill="#405640" stroke="#242b24" stroke-width="5"/><path d="M145 123Q192 136 258 117L272 134Q190 157 133 137Z" fill="#314636" stroke="#c8ae77" stroke-width="4"/><path d="M183 115q20 8 50 1" stroke="#d5b06d" stroke-width="6" fill="none"/></g>`;
    if(outfit==='scarf')return `<g class="yr-extra"><path d="M130 276Q181 296 252 272L253 299Q194 321 135 299Z" fill="#a96447" stroke="#e4b78a" stroke-width="4"/><path d="M227 298q18 51 3 91l-18-6 2-83Z" fill="#b46a4a" stroke="#edbd86" stroke-width="3"/><path d="M228 316l-4 57" stroke="#edbc83" stroke-width="3"/></g>`;
    if(outfit==='satchel')return `<g class="yr-extra"><path d="M130 308Q189 336 267 428" fill="none" stroke="#b49c62" stroke-width="7"/><path d="M255 419q22-9 52 0l-2 57-52-4Z" fill="#7c693d" stroke="#d9bb77" stroke-width="4"/><path d="M255 426q29-12 52 0l-9 19-43-3Z" fill="#9d8454" stroke="#d9bb77" stroke-width="2"/></g>`;
    if(outfit==='cape')return `<g class="yr-extra"><path d="M131 300Q85 347 79 437Q184 516 277 454Q275 337 238 297Z" fill="#475d46" stroke="#afbc91" stroke-width="5" opacity=".86"/><path d="M102 434Q185 477 258 449" stroke="#a7b791" stroke-width="3" fill="none"/></g>`;
    return '';
  }
  // Deterministic illustration details: no per-frame noise, cutout or image switching.
  function furInk(part) {
    let seed=part==='head'?78249:30571;
    const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
    const paths=['','','',''];
    for(let i=0;i<(part==='head'?260:380);i++){
      const x=part==='head'?87+rnd()*190:94+rnd()*178;
      const y=part==='head'?129+rnd()*149:295+rnd()*178;
      // No brush marks over the animated eyes, muzzle or expression.
      if(part==='head'&&x>111&&x<250&&y>180&&y<252)continue;
      const length=(part==='head'?3:5)+rnd()*(part==='head'?9:12);
      const slant=(rnd()-.5)*(part==='head'?10:7);
      const idx=Math.floor(rnd()*4);
      paths[idx]+='M'+x.toFixed(1)+' '+y.toFixed(1)+'q'+(slant*.5).toFixed(1)+' '+(length*.35).toFixed(1)+' '+slant.toFixed(1)+' '+length.toFixed(1);
    }
    const shades=[['#c7a077','.32','1.1'],['#795339','.43','1.3'],['#140e0d','.49','1.15'],['#e3c6a0','.2','.9']];
    return '<g class="yr-ink-detail" clip-path="url(#yr-'+part+'-coat-clip)" fill="none" stroke-linecap="round">'+
      paths.map((d,i)=>'<path d="'+d+'" stroke="'+shades[i][0]+'" opacity="'+shades[i][1]+'" stroke-width="'+shades[i][2]+'"/>').join('')+'</g>';
  }
  function svg(outfit='default'){
    return `<svg class="yr-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="yr-fur" x1="0" x2=".9" y1="0" y2="1"><stop stop-color="#342722"/><stop offset=".60" stop-color="#241b19"/><stop offset="1" stop-color="#1b1615"/></linearGradient>
        <linearGradient id="yr-bib" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#504034"/><stop offset="1" stop-color="#2c2420"/></linearGradient>
        <radialGradient id="yr-eye"><stop stop-color="#ffe08a"/><stop offset=".58" stop-color="#f3b43a"/><stop offset="1" stop-color="#d88724"/></radialGradient>
        <clipPath id="yr-eye-left-clip" clipPathUnits="userSpaceOnUse"><ellipse cx="143" cy="200" rx="23" ry="27"/></clipPath>
        <clipPath id="yr-eye-right-clip" clipPathUnits="userSpaceOnUse"><ellipse cx="220" cy="200" rx="22" ry="28"/></clipPath>
        <linearGradient id="yr-gold" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#fff0af"/><stop offset=".55" stop-color="#e6b755"/><stop offset="1" stop-color="#a26d2d"/></linearGradient>
        <clipPath id="yr-head-coat-clip"><path d="M96 164Q103 143 127 132L134 126L141 127L149 113L157 121L168 110L176 121L189 109L198 120L208 112L216 127Q253 130 270 158L261 163Q281 174 280 193L287 200L279 207Q283 221 269 230L276 238Q266 262 239 271L228 267Q207 285 181 285Q157 287 136 276L125 279Q102 268 96 252L85 251L91 237Q78 224 84 208L77 202Q79 177 96 164Z"/></clipPath><clipPath id="yr-body-coat-clip"><path d="M142 283Q117 275 105 302L111 307Q94 313 91 332L83 342L92 350Q76 393 104 445Q128 479 181 478Q253 485 277 444Q297 405 282 367L288 351L276 344Q273 312 248 291Q238 282 223 282Z"/></clipPath>
      </defs>
      <ellipse class="yr-floor" cx="180" cy="474" rx="125" ry="19" fill="#231a16" opacity=".24"/>
      <g class="yr-tail" transform-origin="270px 385px">
        <path d="M247 378Q278 360 302 383Q318 400 311 421Q301 441 278 445L254 445Q276 427 267 410Q259 393 247 378Z" fill="#251d1a"/>
        <path d="M248 378Q278 359 305 390M278 445L254 445" fill="none" stroke="#171310" stroke-width="5" stroke-linecap="round"/>
        <g class="yr-tail-tip" transform-origin="304px 410px">
          <path d="M296 385Q325 386 336 405Q348 422 325 437Q303 451 281 445Q301 428 306 410Q309 396 296 385Z" fill="#251d1a"/>
          <path d="M303 386Q330 394 336 407Q342 423 324 437Q301 450 281 445" stroke="#171310" fill="none" stroke-width="5" stroke-linecap="round"/>
          <path d="M306 394Q330 407 312 427" stroke="#6b5240" fill="none" stroke-width="6" stroke-linecap="round" opacity=".48"/>
        </g>
      </g>
      <g class="yr-body" transform-origin="185px 436px">
        <path d="M142 283Q117 275 105 302L111 307Q94 313 91 332L83 342L92 350Q76 393 104 445Q128 479 181 478Q253 485 277 444Q297 405 282 367L288 351L276 344Q273 312 248 291Q238 282 223 282Z" fill="url(#yr-fur)" stroke="#171411" stroke-width="6"/>
        <path d="M128 318Q111 340 115 394Q122 427 143 445" fill="none" stroke="#6b4c3c" stroke-width="7" opacity=".37" stroke-linecap="round"/>
        <path d="M235 312Q264 344 265 403Q263 432 248 444" fill="none" stroke="#82604c" stroke-width="5" opacity=".25" stroke-linecap="round"/>
        <path d="M152 305Q175 298 218 306Q244 352 224 427Q181 463 137 421Q125 349 152 305Z" fill="url(#yr-bib)" opacity=".9"/>
        <g fill="none" stroke="#8e7055" stroke-width="3" opacity=".24" stroke-linecap="round">
          <path d="M160 332l-6 21m26-21-6 26m29-25 6 22m-55 15-6 19m35-12-3 26m25-26 5 25m-48 15 8 17m32-17-3 18"/>
        </g>
        <path d="M135 303q-16 19-19 41l12-7-6 23 13-11-5 26 14-17 4-36m95-15q16 17 18 42l-10-9 7 24-13-11 3 25-13-18-3-29" fill="none" stroke="#a27651" stroke-width="3.4" opacity=".33" stroke-linecap="round"/>${furInk("body")}
      </g>
      <g class="yr-hind-feet" fill="#29211c" stroke="#17130f" stroke-width="4">
        <path d="M110 420q-29 13-29 36 2 27 51 25l23-26Z"/>
        <path d="M235 454q25-36 52-19 20 13 7 34-9 17-48 13Z"/>
      </g>
      <g class="yr-left-leg" transform-origin="149px 324px">
        <path d="M148 323Q125 320 122 349L123 410Q138 428 162 411L174 354Q176 333 148 323Z" fill="#29211c" stroke="#191511" stroke-width="4.5"/>
        <path d="M143 340Q130 357 131 393" fill="none" stroke="#72513d" stroke-width="4" opacity=".47" stroke-linecap="round"/>
        <g class="yr-left-forearm" transform-origin="143px 393px">
          <path d="M127 380Q147 373 165 386L169 445Q172 468 141 473Q115 475 114 452L119 406Q119 388 127 380Z" fill="#2d221d"/>
          <path d="M121 404Q118 427 115 446Q112 459 125 468M164 402L170 447" fill="none" stroke="#191511" stroke-width="4" stroke-linecap="round" opacity=".89"/>
          <path d="M132 396Q125 412 125 426" fill="none" stroke="#76533f" stroke-width="3.5" opacity=".5" stroke-linecap="round"/>
          <g class="yr-left-paw" transform-origin="143px 450px">
            <path d="M122 437Q141 429 160 436Q176 448 169 463Q162 479 136 477Q108 476 110 457Q112 444 122 437Z" fill="#352820" stroke="#17130f" stroke-width="4"/>
            <path d="M132 451v16m17-15v16m-27-5q9 7 20 3" fill="none" stroke="#785943" stroke-width="3" stroke-linecap="round"/>
          </g>
        </g>
      </g>
      <g class="yr-right-leg" transform-origin="214px 324px">
        <path d="M211 322Q238 317 242 351L242 412Q220 428 198 411L189 354Q187 332 211 322Z" fill="#2b211d" stroke="#191511" stroke-width="4.5"/>
        <path d="M216 340Q231 359 230 394" fill="none" stroke="#76543e" stroke-width="4" opacity=".43" stroke-linecap="round"/>
        <g class="yr-right-forearm" transform-origin="222px 393px">
          <path d="M198 386Q217 374 239 382Q248 395 249 414L251 451Q250 471 225 473Q196 475 190 452L192 404Q193 392 198 386Z" fill="#30231d"/>
          <path d="M195 407L191 447Q189 459 203 467M243 402L249 446" fill="none" stroke="#191511" stroke-width="4" stroke-linecap="round" opacity=".89"/>
          <path d="M218 398Q232 415 232 430" fill="none" stroke="#76513d" stroke-width="3.5" opacity=".52" stroke-linecap="round"/>
          <g class="yr-right-paw" transform-origin="223px 451px">
            <path d="M199 439Q221 430 242 439Q257 448 253 463Q247 480 223 479Q194 479 189 461Q186 449 199 439Z" fill="#382a21" stroke="#17130f" stroke-width="4"/>
            <path d="M210 452v17m16-18 1 17m14-9q-9 9-22 8" fill="none" stroke="#7d5b43" stroke-width="3" stroke-linecap="round"/>
          </g>
        </g>
      </g>
      <g class="yr-neck" aria-hidden="true">
        <path d="M128 259q50 28 113 0l13 46Q179 326 118 302Z" fill="#25201a" stroke="#171411" stroke-width="5"/>
        <path d="M125 282q58 27 126-5l2 18q-66 30-130 7Z" fill="#849068" stroke="#47543a" stroke-width="4"/><path d="M128 287q57 22 116-3m-117 9q63 22 119-3" fill="none" stroke="#c4b883" stroke-width="2" opacity=".57"/>
        <path d="M240 282q15 20 28 38l-26-9-12 26-5-35" fill="#859368" stroke="#4f6044" stroke-width="3"/>
        <path d="M233 286q17-17 34-8 5 15-8 26-12-4-26-18Z" fill="#9aa781" stroke="#4f6044" stroke-width="3"/>
        <path d="M227 288q-23-12-32 0 16 15 31 8Z" fill="#899775" stroke="#4f6044" stroke-width="3"/>
      </g>
      <g class="yr-charm" transform-origin="178px 303px">
        <path d="M179 302v21" stroke="#b9934d" stroke-width="5" stroke-linecap="round"/>
        <circle cx="179" cy="323" r="4" fill="url(#yr-gold)" stroke="#6d4b26" stroke-width="1.6"/>
        <path d="M186 330a16 16 0 1 0 14 27 19 19 0 1 1-14-27Z" fill="url(#yr-gold)" stroke="#9a6f32" stroke-width="2.3"/>
        <path d="M198 334l2 8m-4-4h9" stroke="#fff2c1" stroke-width="1.9" opacity=".7"/>
      </g>
      <g class="yr-head" transform-origin="181px 267px">
        <g class="yr-ear-left" transform-origin="113px 151px">
          <path d="M111 156Q90 107 92 56Q121 68 153 122Z" fill="#30221e" stroke="#1a1412" stroke-width="6" stroke-linejoin="round"/>
          <path d="M113 143Q101 100 103 77Q119 86 139 125Z" fill="#99614e" stroke="#5b3e31" stroke-width="3"/>
          <path d="M116 127q-2-24-8-35m10 31-5-19m13 24-5-15m-13 13-3-10" stroke="#dba182" stroke-width="2.5" opacity=".64" fill="none" stroke-linecap="round"/>
        </g>
        <g class="yr-ear-right" transform-origin="241px 153px">
          <path d="M211 119Q248 70 267 55Q270 109 253 164Z" fill="#31231f" stroke="#1a1412" stroke-width="6" stroke-linejoin="round"/>
          <path d="M226 124Q250 85 259 78Q261 107 246 148Z" fill="#98614c" stroke="#5b3e32" stroke-width="3"/>
          <path d="M248 96q-9 21-15 27m18-35-14 30m9-11-8 14m12-24-5 20" stroke="#daa081" stroke-width="2.5" opacity=".62" fill="none" stroke-linecap="round"/>
        </g>
        <path d="M96 164Q103 143 127 132L134 126L141 127L149 113L157 121L168 110L176 121L189 109L198 120L208 112L216 127Q253 130 270 158L261 163Q281 174 280 193L287 200L279 207Q283 221 269 230L276 238Q266 262 239 271L228 267Q207 285 181 285Q157 287 136 276L125 279Q102 268 96 252L85 251L91 237Q78 224 84 208L77 202Q79 177 96 164Z" fill="url(#yr-fur)" stroke="#1d1511" stroke-width="4.5" stroke-linejoin="round"/><path d="M102 185q-16 11-18 27l12-3-10 19 16-7m162-39q17 12 17 29l-12-5 9 20-15-10M125 142q13-23 24-15l6-15 12 10 12-13 12 14 15-12 15 22" fill="none" stroke="#8e6445" stroke-width="3" opacity=".55" stroke-linecap="round"/>${furInk("head")}
        <path d="M95 208q-13 22 10 42m161-42q12 22-9 42" stroke="#6f5142" stroke-width="7" fill="none" opacity=".36" stroke-linecap="round"/>
        <g fill="#473329" opacity=".68">
          <path d="M117 172q14-15 31-9 9 2 13 10-18-8-44-1Z"/>
          <path d="M200 170q22-12 42 0l-5 8q-16-11-37-8Z"/>
        </g>
        <g class="yr-eye-set" transform-origin="182px 202px">
          <ellipse cx="143" cy="200" rx="23" ry="27" fill="url(#yr-eye)" stroke="#120f0c" stroke-width="4.5"/>
          <ellipse cx="220" cy="200" rx="22" ry="28" fill="url(#yr-eye)" stroke="#120f0c" stroke-width="4"/>
          <g class="yr-gaze">
            <ellipse cx="146" cy="201" rx="8.1" ry="17.8" fill="#201812"/><ellipse cx="217" cy="201" rx="8.1" ry="17.8" fill="#201812"/>
            <ellipse cx="137" cy="188" rx="5" ry="8" fill="#fff2c3" opacity=".94"/><ellipse cx="211" cy="188" rx="5" ry="8" fill="#fff2c3" opacity=".94"/>
            <circle cx="150" cy="210" r="2.1" fill="#ffefc1" opacity=".7"/><circle cx="221" cy="210" r="2.1" fill="#ffefc1" opacity=".7"/>
          </g>
        </g>
        <g class="yr-lid-window" clip-path="url(#yr-eye-left-clip)">
          <g class="yr-lid-left">
            <rect x="114" y="166" width="58" height="68" fill="#271c19"/>
            <path d="M123 201Q143 207 164 201" stroke="#896149" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          </g>
        </g>
        <g class="yr-lid-window" clip-path="url(#yr-eye-right-clip)">
          <g class="yr-lid-right">
            <rect x="193" y="165" width="55" height="70" fill="#271c19"/>
            <path d="M200 201Q220 207 239 201" stroke="#896149" stroke-width="2.4" fill="none" stroke-linecap="round"/>
          </g>
        </g>
        <path d="M168 234q13-9 26 0l-13 10Z" fill="#a57966" stroke="#211713" stroke-width="2"/>
        <path d="M182 243v7q-10 12-21 0m21 0q11 12 21 0" fill="none" stroke="#b48d7b" stroke-width="3" stroke-linecap="round"/>
        <path d="M133 244q-15 1-23 10m124-10q15 1 23 10" stroke="#5e483b" stroke-width="3" fill="none" opacity=".42"/>
        <g fill="none" stroke="${whisker}" stroke-width="2.1" stroke-linecap="round" opacity=".85">
          <path d="M140 236Q105 222 66 231m74 11q-41-4-74 11m74-5q-38 11-60 25"/>
          <path d="M221 236q35-14 75-5m-74 11q37-4 73 11m-75-5q39 11 62 25"/>
        </g>
        <g fill="#a47a61" opacity=".7"><circle cx="122" cy="230" r="2"/><circle cx="127" cy="238" r="1.7"/><circle cx="116" cy="238" r="1.7"/><circle cx="237" cy="230" r="2"/><circle cx="244" cy="238" r="1.7"/><circle cx="231" cy="238" r="1.7"/></g>
        <path d="M129 151l8-7m18-3 4-9m32 5 6-10m24 19 8-7" stroke="#765445" stroke-width="3" stroke-linecap="round" opacity=".47"/>
        ${detail('M103 208l-9-8m9 26-6 4m159-22 9-8m-6 25 7 6')}
        ${(["hat","flowers"].includes(outfit))?accessories(outfit):""}
      </g>
      ${(!["hat","flowers"].includes(outfit))?accessories(outfit):""}
      <g class="yr-magic" opacity="0" stroke="#ffd889" stroke-linecap="round"><path d="M94 359v15m-7-8h15m192-23v16m-8-8h16" stroke-width="2.5"/></g>
    </svg>`;
  }
  function render({place='hearth',outfit='default',sleepy=false,comforting=false}={}){
    const label=place==='hearth'?'Pet Yarrow, your black cat familiar':'Pet Yarrow in her cozy nook';
    return `<button type="button" class="yarrow-puppet cutout-yarrow ${place==='hearth'?'hearth-character':'profile-character'} ${sleepy?'is-nighttime':''} ${comforting?'is-comforting':''}" data-pose="idle" data-action="pet-yarrow" aria-label="${label}" title="Give Yarrow a gentle pet">${svg(outfit)}<span class="yarrow-touch-glint" aria-hidden="true"></span></button>`;
  }
  function mount(puppet){
    if(!puppet)return null;
    let timeout=0;
    let offerSide='right';
    const scene={ready:true,action:'idle',offerSide,dispose(){clearTimeout(timeout);},pose(name,duration=1400){
      if(!puppet.isConnected)return false;
      clearTimeout(timeout);
      if(name==='offer') {offerSide=offerSide==='right'?'left':'right';scene.offerSide=offerSide;puppet.dataset.side=offerSide;}
      // Restart repeat taps without requiring a full app render.
      if(puppet.dataset.pose===name){puppet.dataset.pose='idle';void puppet.offsetWidth;}
      puppet.dataset.pose=name;scene.action=name;
      if(name!=='idle')timeout=setTimeout(()=>{if(puppet.isConnected){puppet.dataset.pose='idle';scene.action='idle';}},Math.max(500,duration));
      return true;
    }};
    return scene;
  }
  window.YarrowCutout=Object.freeze({render,mount,version:'2.1.0'});
})();
