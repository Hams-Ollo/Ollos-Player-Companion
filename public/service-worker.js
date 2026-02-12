// Kill-switch service worker — unregisters itself immediately.
// Deploy this to replace any previously-installed service worker that
// was intercepting Google API requests and proxying them to /api-proxy/.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => {
  self.registration.unregister();
  self.clients.matchAll({ type: 'window' }).then(clients =>
    clients.forEach(client => client.navigate(client.url))
  );
});
