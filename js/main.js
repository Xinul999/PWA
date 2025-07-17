
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
