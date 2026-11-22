const CACHE='trivial-v15';
const FILES=['./','./index.html','./perguntas.js','./atualidades.json','./lib/qrcode.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png','./icons/favicon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// Rede primeiro, sem cache HTTP; se não houver internet, usa a cópia guardada.
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const same=new URL(r.url).origin===location.origin;
  const net=same?fetch(r.url,{cache:'no-cache',credentials:'same-origin'}):fetch(r);
  e.respondWith(net.then(res=>{if(same&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(r.url.split('?')[0],cp)).catch(()=>{})}return res})
    .catch(()=>caches.match(r.url.split('?')[0]).then(m=>m||caches.match('./index.html'))))});
