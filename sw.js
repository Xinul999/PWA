const CACHE_NAME = 'cache-apps';
const urlsToCache = [
    '/index.html',
    '/css/styles.css',
    '/css/header.css',
    '/css/sidebar.css',
    '/css/search.css',
    '/css/chat.css',
    '/js/main.js',
    '/js/script.js',
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
   })
    e.waitUntil(promiseCache);
});

self.addEventListener('activate', (e) => {
    console.log('Service worker activated!');
    const oldCache = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key!== CACHE_NAME) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(oldCache);
});

self.addEventListener('fetch', (e) => {
    if(skipCdn(e.request.url)){
        console.log('Ignoring request to CDN : ', e.request.url);
        return;
    }

    /*(!navigator.onLine){
        const header = new Headers();
        header.set('Content-Type', 'text/html; charset=UTF-8');
        e.respondWith(new Response('<h1>Pas de connexion internet</h1><p>Application en mode dégradé. Veuillez vous connecter</p>', header));
    }*/
    //console.log('Fetching data from API...');
    // cache only with network fallback
    /*e.respondWith(
        caches.match(e.request)
       .then(responseCache => {
           console.log('Url recupéré directement en cache : ', e.request.url, responseCache);
            if(responseCache){
                return responseCache;
            }
            return fetch(e.request).then(response => {
                console.log('Url recupéré sur le reseau puis en cache : ', e.request.url, response);
                caches.open('cache-apps').then(cache => cache.put(e.request, response));
                // Dupliquer la réponse car consommable qu'une fois
                return response.clone();
            })
       })
    )*/

    // stratégie de network first with cache fallback
    e.respondWith(
       fetch(e.request).then(response => {
           console.log('Url recupéré sur le reseau : ', e.request.url, response);
           caches.open('cache-apps').then(cache => cache.put(e.request, response));
           return response.clone();
       }).catch(error => {
           console.log('Erreur lors de la récupération de données on recupère depuis le cache: ', error);
           return  caches.match(e.request);
       })
    );
});
self.addEventListener('push', (e)=> {
   console.log('Push notification received!');
});

