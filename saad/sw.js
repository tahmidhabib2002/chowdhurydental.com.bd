const CACHE_NAME = 'chowdhury-dental-v1';
const SAAD_PATH = '/saad/';

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        SAAD_PATH, // রুট ডিরেক্টরি
        SAAD_PATH + 'index.html',
        SAAD_PATH + 'log.html',      // আপনার লিস্টে এই ফাইলটি আছে
        SAAD_PATH + 'config.js',     // Firebase এর কনফিগ ফাইল
        SAAD_PATH + 'manifest.json',
        'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // শুধুমাত্র নির্দিষ্ট পাথ এবং এক্সটার্নাল ফন্ট/আইকন হ্যান্ডেল করবে
  if (!url.pathname.startsWith(SAAD_PATH) && 
      !url.hostname.includes('fonts.') && 
      !url.hostname.includes('cdnjs.')) {
    return;
  }

  // HTML নেভিগেশন - অফলাইনে index.html ব্যাকআপ হিসেবে দেখাবে
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(SAAD_PATH + 'index.html');
      })
    );
    return;
  }

  // স্ট্যাটিক ফাইল হ্যান্ডলিং
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchRes => {
        // শুধুমাত্র GET রিকোয়েস্ট এবং সফল রেসপন্স ক্যাশ করবে
        if (event.request.method === 'GET' && fetchRes.status === 200) {
          const resClone = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
        }
        return fetchRes;
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
