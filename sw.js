/* A Whisker a Day: gentle offline support, network-first for fresh pages */
const CACHE_NAME = 'whisker-a-day-v1.5.1';
const HOME = './index.html';
self.addEventListener('install',event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(['./',HOME,'./app-icon.svg','./manifest.webmanifest'])).then(()=>self.skipWaiting()));
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
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
