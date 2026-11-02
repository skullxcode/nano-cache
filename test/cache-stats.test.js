const test = require('node:test');
const assert = require('node:assert/strict');

const createCache = require('../index');

test('starts with zero statistics', () => {
  const cache = createCache();

  assert.deepEqual(cache.stats(), {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 0,
    hitRate: 0,
  });
});

test('counts successful get requests as hits', () => {
  const cache = createCache();

  cache.set('a', 10);
  cache.get('a');
  cache.get('a');

  assert.equal(cache.stats().hits, 2);
});

test('counts missing get requests as misses', () => {
  const cache = createCache();

  cache.get('missing');

  assert.equal(cache.stats().misses, 1);
});

test('counts expired get requests as misses', () => {
  let now = 1000;

  const cache = createCache({
    defaultTtl: 100,
    clock: () => now,
  });

  cache.set('a', 10);

  now = 1100;
  cache.get('a');

  assert.equal(cache.stats().misses, 1);
});

test('does not count has requests as hits or misses', () => {
  const cache = createCache();

  cache.set('a', 10);

  cache.has('a');
  cache.has('missing');

  assert.equal(cache.stats().hits, 0);
  assert.equal(cache.stats().misses, 0);
});

test('counts capacity evictions', () => {
  const cache = createCache({
    maxEntries: 2,
    evictionPolicy: 'lru',
  });

  cache.set('a', 10);
  cache.set('b', 20);
  cache.set('c', 30);

  assert.equal(cache.stats().evictions, 1);
});

test('does not count manual deletions as evictions', () => {
  const cache = createCache();

  cache.set('a', 10);
  cache.del('a');

  assert.equal(cache.stats().evictions, 0);
});

test('calculates hit rate correctly', () => {
  const cache = createCache();

  cache.set('a', 10);

  cache.get('a');
  cache.get('a');
  cache.get('missing');
  cache.get('missing');

  assert.equal(cache.stats().hitRate, 0.5);
});

test('resetStats resets counters without clearing entries', () => {
  const cache = createCache();

  cache.set('a', 10);
  cache.get('a');
  cache.get('missing');

  cache.resetStats();

  assert.deepEqual(cache.stats(), {
    hits: 0,
    misses: 0,
    evictions: 0,
    size: 1,
    hitRate: 0,
  });

  assert.equal(cache.get('a'), 10);
});

test('statistics return a snapshot', () => {
  const cache = createCache();

  cache.set('a', 10);

  const result = cache.stats();
  result.hits = 100;
  result.size = 100;

  assert.equal(cache.stats().hits, 0);
  assert.equal(cache.stats().size, 1);
});
