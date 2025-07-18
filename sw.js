const CACHE_NAME = 'studyconnect-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/header.css',
    '/css/sidebar.css',
    '/css/search.css',
    '/css/chat.css',
    '/js/main.js',
    '/js/minifyJs.min.js',
    '/manifest.json',
    '/img/favicon.svg',
    '/img/favicon-32x32.png',
    '/img/favicon-16x16.png',
    '/img/apple-touch-icon.png'
];

const skipCdn = url => {
    try {
        const urlTest = new URL(url);
        return !!(urlTest.hostname.includes("cdn") ||
            urlTest.origin !== self.location.origin ||
            url.includes('contentScript.js') ||
            url.includes('chrome-extension'));
    } catch (e) {
        return true;
    }
}

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Supprimer les anciens caches
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Stratégie Cache First pour les ressources statiques
    if (urlsToCache.includes(url.pathname)) {
        event.respondWith(
            caches.match(request)
                .then(response => {
                    if (response) {
                        return response;
                    }
                    return fetch(request)
                        .then(fetchResponse => {
                            const responseClone = fetchResponse.clone();
                            caches.open(STATIC_CACHE)
                                .then(cache => cache.put(request, responseClone));
                            return fetchResponse;
                        });
                })
                .catch(() => {
                    // Fallback pour les pages HTML
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
        );
    }
    // Stratégie Network First pour les données dynamiques
    else if (request.method === 'GET' && !request.url.includes('chrome-extension')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then(cache => cache.put(request, responseClone));
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
    }
});

self.addEventListener('push', (e) => {
    console.log('Push notification received!');
});
