/* A Whisker a Day: gentle offline support, network-first for fresh pages */
const CACHE_NAME = 'whisker-a-day-v2.5-shell2';
const HOME = './index.html';
self.addEventListener('install',event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(['./',HOME,'./app-icon.svg','./manifest.webmanifest','./assets/yarrow-storybook.webp','./assets/hearth-v24/apothecary.webp','./assets/hearth-v24/yarrow-parts.webp','./assets/cottage-reading-nook.webp','./assets/cottage/rooms/hearth.webp','./assets/cottage/rooms/bedroom.webp','./assets/cottage/rooms/kitchen.webp','./assets/cottage/rooms/crafting.webp','./assets/Jar.PNG','./assets/wearables/flower-crown.webp','./assets/wearables/autumn-scarf.webp','./assets/wearables/witch-hat.webp','./assets/wearables/herb-satchel.webp','./assets/wearables/mossy-cloak.webp','./assets/wearables/starlight-collar.webp','./assets/wearables/rosewood-beret.webp','./assets/wearables/acorn-pendant.webp','./assets/cottage/window-fern.webp','./assets/cottage/brass-lantern.webp','./assets/cottage/woven-rug.webp','./assets/cottage/river-stones.webp','./assets/cottage/old-herbals.webp','./assets/cottage/copper-teapot.webp','./assets/cottage/moss-green-cushion.webp','./assets/cottage/moon-clock.webp','./assets/cottage/pressed-flower-frame.webp','./assets/cottage/gathering-basket.webp','./assets/cottage/mushroom-ornament.webp','./assets/cottage/faux-candle-lantern.webp','./assets/cottage/patchwork-quilt.webp','./assets/audio/yarrow-purr.mp3'])).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event => {
  event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('whisker-a-day-') && name!==CACHE_NAME).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event => {
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response => {
      if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(HOME,copy)).catch(()=>{});}
      return response;
    }).catch(()=>caches.match(HOME)));
    return;
  }
  event.respondWith(fetch(event.request,{cache:'no-store'}).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy)).catch(()=>{});}return response;}).catch(()=>caches.match(event.request)));
});
