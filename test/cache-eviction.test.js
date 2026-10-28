const test = require('node:test');
const assert = require('node:assert/strict');

const createCache = require('../index');

test('evicts least recently used entry when capacity is reached', () => {
  const cache = createCache({
    maxEntries: 3,
    evictionPolicy: 'lru',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('c', 30);

  cache.get('a');

  cache.set('d', 40);

  assert.equal(cache.has('a'), true);
  assert.equal(cache.has('b'), false);
  assert.equal(cache.has('c'), true);
  assert.equal(cache.has('d'), true);
  assert.equal(cache.size(), 3);
});

test('does not evict when updating an existing key', () => {
  const cache = createCache({
    maxEntries: 2,
    evictionPolicy: 'lru',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('a', 100);

  assert.equal(cache.size(), 2);
  assert.equal(cache.get('a'), 100);
  assert.equal(cache.has('b'), true);
});

test('uses the default unbounded capacity', () => {
  const cache = createCache();

  for (let i = 0; i < 100; i++) {
    cache.set(`key-${i}`, i);
  }

  assert.equal(cache.size(), 100);
});

test('rejects invalid maxEntries values', () => {
  for (const value of [0, -1, 1.5, '10', NaN]) {
    assert.throws(() => createCache({ maxEntries: value }), RangeError);
  }
});

test('reclaims expired entries before eviction', () => {
  let now = 1000;

  const cache = createCache({
    maxEntries: 2,
    defaultTtl: 200,
    clock: () => now,
    evictionPolicy: 'lru',
  });

  // a expires earlier than b
  cache.set('a', 10, 50);
  cache.set('b', 20);

  // Only a has expired
  now = 1060;

  cache.set('c', 30);

  assert.equal(cache.has('a'), false);
  assert.equal(cache.has('b'), true);
  assert.equal(cache.has('c'), true);
  assert.equal(cache.size(), 2);
});

test('supports LFU eviction through the cache engine', () => {
  const cache = createCache({
    maxEntries: 3,
    evictionPolicy: 'lfu',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('c', 30);

  cache.get('a');
  cache.get('a');
  cache.get('c');

  cache.set('d', 40);

  assert.equal(cache.has('a'), true);
  assert.equal(cache.has('b'), false);
  assert.equal(cache.has('c'), true);
  assert.equal(cache.has('d'), true);
});

test('supports FIFO eviction through the cache engine', () => {
  const cache = createCache({
    maxEntries: 3,
    evictionPolicy: 'fifo',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('c', 30);

  cache.get('a');
  cache.set('d', 40);

  assert.equal(cache.has('a'), false);
  assert.equal(cache.has('b'), true);
  assert.equal(cache.has('c'), true);
  assert.equal(cache.has('d'), true);
  assert.equal(cache.size(), 3);
});

test('supports LIFO eviction through the cache engine', () => {
  const cache = createCache({
    maxEntries: 3,
    evictionPolicy: 'lifo',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('c', 30);

  cache.get('a');
  cache.set('d', 40);

  assert.equal(cache.has('a'), true);
  assert.equal(cache.has('b'), true);
  assert.equal(cache.has('c'), false);
  assert.equal(cache.has('d'), true);
  assert.equal(cache.size(), 3);
});
