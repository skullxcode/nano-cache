# @skullx/nano-cache

A lightweight, zero-dependency, in-memory key-value cache for Node.js with configurable TTL expiration, capacity limits, and multiple eviction policies.

## Features

- Zero runtime dependencies
- Configurable time-to-live (TTL)
- Custom TTL for individual entries
- Maximum cache capacity
- Six eviction policies: LRU, LFU, FIFO, LIFO, MRU, and Random
- Cache statistics and hit-rate tracking
- TypeScript declarations included
- Injectable clock for deterministic testing
- Built on JavaScript `Map`

## Installation

```bash
npm install @skullx/nano-cache
```

## Quick Start

```js
const createCache = require('@skullx/nano-cache');

const cache = createCache();

cache.set('username', 'ujjwal');

console.log(cache.get('username')); // 'ujjwal'
console.log(cache.has('username')); // true
console.log(cache.size());          // 1
```

## Configuration

Pass an options object to `createCache()`.

| Option | Default | Description |
|---|---|---|
| `defaultTtl` | `60000` | Default expiration time in milliseconds |
| `maxEntries` | `Infinity` | Maximum number of entries |
| `evictionPolicy` | `'lru'` | Policy used when capacity is reached |
| `clock` | `Date.now` | Injectable clock function |

Example:

```js
const cache = createCache({
  defaultTtl: 30000,
  maxEntries: 1000,
  evictionPolicy: 'lru',
});
```

## TTL Expiration

TTL is specified in milliseconds.

```js
const cache = createCache({
  defaultTtl: 5000,
});

cache.set('session', 'active');
cache.set('temporary', 'value', 1000);
cache.set('permanent', 'value', Infinity);
```

- Positive TTL values expire after the specified duration.
- `0` means the entry expires immediately.
- `Infinity` means the entry never expires.
- Negative TTL values are rejected.

Expired entries are cleaned up lazily during cache operations such as `get()`, `has()`, `size()`, and before capacity eviction.

## Eviction Policies

When `maxEntries` is reached, the configured policy determines which entry is removed.

| Policy | Behavior |
|---|---|
| `lru` | Least Recently Used |
| `lfu` | Least Frequently Used |
| `fifo` | First In, First Out |
| `lifo` | Last In, First Out |
| `mru` | Most Recently Used |
| `random` | Randomly selected entry |

Example:

```js
const cache = createCache({
  maxEntries: 3,
  evictionPolicy: 'lfu',
});

cache.set('a', 1);
cache.set('b', 2);
cache.set('c', 3);
cache.set('d', 4);
```

The LFU policy evicts the entry with the lowest access frequency. Ties are resolved using recency.

## API Reference

### `createCache(options?)`

Creates and returns a cache instance.

### `set(key, value, customTtl?)`

Stores a value under a key. An optional custom TTL overrides the default TTL.

### `get(key)`

Returns the stored value, or `null` if the key is missing or expired.

### `has(key)`

Returns whether a non-expired entry exists.

### `del(key)`

Deletes an entry. Returns `true` if an entry was deleted, otherwise `false`.

### `clear()`

Removes all entries from the cache.

### `size()`

Returns the number of non-expired entries.

### `stats()`

Returns a snapshot of cache statistics.

```js
console.log(cache.stats());

// {
//   hits: 10,
//   misses: 2,
//   evictions: 1,
//   size: 5,
//   hitRate: 0.8333333333333334
// }
```

### `resetStats()`

Resets hit, miss, and eviction counters without clearing cached entries.

## TypeScript

TypeScript declarations are included.

```ts
import createCache = require('@skullx/nano-cache');

const cache = createCache<string>({
  maxEntries: 100,
  defaultTtl: 5000,
  evictionPolicy: 'lru',
});

cache.set('name', 'nano-cache');

const value: string | null = cache.get('name');
```

Supported eviction policy names are available through the `EvictionPolicy` type in the declaration namespace.

## Development

Run the test suite:

```bash
npm test
```

Run TypeScript declaration checks:

```bash
npx --yes --package typescript tsc \
  --noEmit \
  --strict \
  --target ES2020 \
  --module commonjs \
  type-tests/types.test.ts
```

Run benchmarks:

```bash
npm run benchmark
```

## Benchmarks

Benchmarks compare native JavaScript `Map` operations with cache operations and measure the performance of the available eviction policies.

Results depend on the Node.js version, hardware, and workload. Run benchmarks on your own environment before drawing performance conclusions.

## License

MIT
