/* Ordo Laudis — Service Worker desactivador.
   Se incluye para eliminar cachés y registros antiguos de pruebas previas. */

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(key => caches.delete(key))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then(clients => {
        clients.forEach(client => client.navigate(client.url));
      })
  );
});
