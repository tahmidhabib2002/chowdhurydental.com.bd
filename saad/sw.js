const CACHE_NAME = 'chowdhury-dental-v3'; // ভার্সন চেঞ্জ করুন v2 থেকে v3
const urlsToCache = [
  '/saad/log.html',
  '/saad/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js'
];

self.addEventListener('install', event => {
  console.log('নতুন Service Worker ইন্সটল হচ্ছে...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('নতুন ফাইল ক্যাশ করা হচ্ছে...');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('ক্যাশ থেকে পাওয়া গেছে:', event.request.url);
          return response;
        }
        console.log('নেটওয়ার্ক থেকে নেওয়া হচ্ছে:', event.request.url);
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('নতুন Service Worker অ্যাক্টিভেট হচ্ছে...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('পুরনো ক্যাশ ডিলিট করা হচ্ছে:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});
