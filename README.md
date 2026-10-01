# nano-cache

A lightweight, zero-dependency in-memory key-value cache with custom TTL (Time-To-Live) expiration, built using closures and native JavaScript `Map`. Crafted with precision by **skullx**.

## Features

* **⚡ Lightning Fast:** $O(1)$ lookups, updates, and deletions powered by native JavaScript `Map`.

* **⏱️ Custom TTL Support:** Set a default expiration time or override it per key.

* **🧹 Automatic Memory Cleanup:** Lazy expiration cleanup keeps your cache lean without background timer leaks.

* **🛡 Robust Validation:** Strict input checking to prevent type errors.

* **📦 Zero Dependencies:** Lightweight and clean with no external bloat.

## Installation

```bash
npm install nano-cache
```

## Usage

```javascript
const createCache = require('nano-cache');

// Initialize cache with a default TTL of 5 seconds (5000 ms)
const cache = createCache({ defaultTtl: 5000 });

// 1. Set a value with default TTL
cache.set('user:1', { name: 'Ujjwal' });

// 2. Set a value with a custom TTL (e.g., 2 seconds)
cache.set('temp:token', 'xyz123', 2000);

// 3. Get a value
console.log(cache.get('user:1')); // { name: 'Ujjwal' }

// 4. Check if a key exists
console.log(cache.has('user:1')); // true

// 5. Get current cache size (automatically purges expired items)
console.log(cache.size()); // 2

// 6. Explicitly delete a key
cache.del('temp:token');

// 7. Clear the entire cache
cache.clear();
```

## Advanced Examples

### Handling Expiration

```javascript
const shortCache = createCache({ defaultTtl: 1000 }); // 1 second

shortCache.set('token', 'secret123');
console.log(shortCache.get('token')); // 'secret123'

// Wait 1.5 seconds...
setTimeout(() => {
  console.log(shortCache.get('token')); // null (expired)
  console.log(shortCache.has('token')); // false
}, 1500);
```

### Handling Validation Errors

```javascript
try {
  cache.set('', 'value'); // Throws TypeError because key is empty
} catch (error) {
  console.error(error.message); // Cache key must be a non-empty string.
}
```

## API Reference

### `createCache(options)`

Creates a new cache instance.

* `options.defaultTtl` *(Number)*: Default expiration time in milliseconds. Defaults to `60000` (1 minute).

### Methods

* **`set(key, value, [customTtl])`**: Stores a value with an optional custom TTL. Returns the entry object. Throws a `TypeError` if the key is not a non-empty string.

* **`get(key)`**: Retrieves the value associated with the key. Returns `null` if the key does not exist or has expired.

* **`has(key)`**: Returns a boolean indicating whether a valid, unexpired key exists.

* **`del(key)`**: Explicitly removes a key from the cache. Returns `true` if the key existed and was deleted, otherwise `false`.

* **`clear()`**: Wipes all items from the cache.

* **`size()`**: Returns the count of active, unexpired items in the cache (automatically triggers cleanup of dead entries).

## Author

Built with passion by **skullx**.

## License

[MIT](LICENSE)