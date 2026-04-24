const CACHE_NAME = '1688-mart-v2';
const STATIC_CACHE = '1688-static-v2';
const DYNAMIC_CACHE = '1688-dynamic-v2';
const IMAGE_CACHE = '1688-images-v2';

const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/auth.js',
  '/wishlist.js',
  '/product.js',
  '/cart.js',
  '/checkout.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== IMAGE_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') return;
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return;
  
  // Strategy for HTML pages - Network first, fallback to cache
  if (request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then(cache => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then(cached => {
            if (cached) return cached;
            // Return offline page if available
            return caches.match('/index.html');
          });
        })
    );
    return;
  }
  
  // Strategy for images - Cache first, fallback to network
  if (request.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(cache => {
        return cache.match(request).then(cached => {
          if (cached) return cached;
          
          return fetch(request).then(response => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          }).catch(() => {
            // Return placeholder for failed image loads
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
                <rect width="100%" height="100%" fill="#f0f2f5"/>
                <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Image Unavailable</text>
              </svg>`,
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          });
        });
      })
    );
    return;
  }
  
  // Strategy for CSS/JS/Fonts - Stale while revalidate
  event.respondWith(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.match(request).then(cached => {
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        }).catch(() => cached);
        
        return cached || fetchPromise;
      });
    })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'sync-cart') {
    event.waitUntil(syncCartData());
  }
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrderData());
  }
});

async function syncCartData() {
  // Sync cart data when back online
  console.log('Syncing cart data...');
}

async function syncOrderData() {
  // Sync order data when back online
  console.log('Syncing order data...');
}

// Push notification handling
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'New notification from 1688 Electronic Mart',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    tag: 'notification-1',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icon-72x72.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('1688 Electronic Mart', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CACHE_ASSETS') {
    caches.open(DYNAMIC_CACHE).then(cache => {
      cache.addAll(event.data.assets);
    });
  }
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    if (event.tag === 'update-products') {
      event.waitUntil(updateProductCache());
    }
  });
}

async function updateProductCache() {
  // Update cached product data periodically
  console.log('Updating product cache...');
}
