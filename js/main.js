

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
            const notification = new Notification('Notification autorisée');
        }else{
            console.log('Notification non autorisée');
        }
    })
}