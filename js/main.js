

/*On verifie que le service worker est disponible dans le navigateur*/
if(navigator.serviceWorker){
    navigator.serviceWorker.register('/sw.js').then((registration) =>{
        console.log('Service Worker enregistrer: ', registration.scope);
    }).catch(registrationError => {
        console.log('Erreur enregistrement du Service Worker:', registrationError);
    });
}else{
    console.log('Service Worker n\'est pas supporté');
}


if(window.Notification && window.Notification !== 'denied'){
    Notification.requestPermission(permission => {
        if(permission === 'granted'){
            const options = {
                body: 'Cette notification est une preuve que le service worker est fonctionnel',
                icon: 'ico/icon-72-72.png'
            };
            const notification = new Notification('Notification autorisée', options);
        }else{
            console.log('Notification non autorisée');
        }
    })
}