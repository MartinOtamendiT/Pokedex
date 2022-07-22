//Asignar nombre y versión al cache.
const cachePokedex = 'pokedex-site-v1',
    assets = [
    './',
    'https://fonts.googleapis.com/css?family=Audiowide',
    './pokestyles.css',
    './pokedex.js',
    './Images/pokeball_icon.png',
    './Images/OcenPokemon.png'
  ]

//Instalación, generalmente se almacenan en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cachePokedex)
      .then(cache => {
        return cache.addAll(assets)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [assets]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
        if (res) {
          //recuperar del cache
          return res
        }
        //recuperar de la petición a la url
        return fetch(e.request)
      })
  )
})