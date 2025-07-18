const CACHE_NAME = 'cache-apps';
const urlsToCache = [
    '/index.html',
    '/css/styles.css',
    '/css/header.css',
    '/css/sidebar.css',
    '/css/search.css',
    '/css/chat.css',
    '/js/main.js',
    '/js/minifyJs.min.js',
    '/manifest.json'
]


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


self.addEventListener('install', (e) => {
    console.log('Service worker installed!');
    const promiseCache = caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(urlsToCache);
    });
    e.waitUntil(promiseCache);
});


self.addEventListener('activate', (e) => {
    console.log('Service worker activated!');
    const oldCache = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== CACHE_NAME) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(oldCache);
});


self.addEventListener('fetch', (e) => {
    if (skipCdn(e.request.url)) {
        console.log('Ignoring request to CDN : ', e.request.url);
        return;
    }
    // stratégie de network first with cache fallback
    e.respondWith(
        fetch(e.request).then(response => {
            console.log('Url recupéré sur le reseau : ', e.request.url, response);
            caches.open('cache-apps').then(cache => cache.put(e.request, response));
            return response.clone();
        }).catch(error => {
            console.log('Erreur lors de la récupération de données on recupère depuis le cache: ', error);
            return caches.match(e.request);
        })
    );
});


self.addEventListener('push', (e) => {
    console.log('Push notification received!');
});

