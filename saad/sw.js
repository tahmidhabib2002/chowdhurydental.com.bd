const CACHE_NAME = 'chowdhury-dental-v1';
const urlsToCache = [
    '/saad/',
    '/saad/index.html',
    '/saad/profile.html',
    '/saad/log.html',
    '/saad/manifest.json',
    '/saad/icons/icon-192x192.png',
    '/saad/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // ক্যাশে থাকলে সেটা দাও, নাহলে নেটওয়ার্ক থেকে আনো
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});