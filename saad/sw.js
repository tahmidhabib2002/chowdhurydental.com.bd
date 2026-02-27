const CACHE_NAME = 'chowdhury-dental-v1';
const SAAD_PATH = '/saad/';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        SAAD_PATH + 'index.html',
        SAAD_PATH + 'dashboard.html',
        SAAD_PATH + 'manifest.json',
        'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // শুধুমাত্র /saad/ পাথের রিকোয়েস্ট হ্যান্ডেল করবে
  if (!url.pathname.startsWith('/saad/') && 
      !url.href.startsWith('https://fonts.') && 
      !url.href.startsWith('https://cdnjs.')) {
    return;
  }

  // HTML নেভিগেশন - সবসময় index.html দেখাবে
  if (event.request.mode === 'navigate' && url.pathname.startsWith('/saad/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(SAAD_PATH + 'index.html');
        })
    );
    return;
  }

  // স্ট্যাটিক ফাইল - ক্যাশ থেকে দেখাবে
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});
