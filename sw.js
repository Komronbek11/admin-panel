// Название кэша и файлы для кэширования
const CACHE_NAME = 'admin-panel-cache-v1';
const URLS_TO_CACHE = [
  '.', // Кэширует главный файл (index.html)
  'manifest.json',
  // Добавьте сюда пути к вашим иконкам
  'icons/icon-192x192.png',
  'icons/icon-512x512.png'
  // Если у вас есть другие важные файлы (CSS, другие JS), добавьте их сюда
];

// 1. Установка Service Worker и кэширование файлов
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Кэш открыт');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

// 2. Активация Service Worker
self.addEventListener('activate', (event) => {
  // Тут можно удалить старые кэши, если они есть
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


// 3. Перехват запросов (fetch) для офлайн-работы
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Если ресурс найден в кэше, возвращаем его.
        // Иначе, делаем запрос к сети.
        return response || fetch(event.request);
      })
  );
});