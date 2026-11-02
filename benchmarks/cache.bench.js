const { performance } = require('node:perf_hooks');
const createCache = require('../');

const ITERATIONS = 500_000;
const WARMUP_ITERATIONS = 50_000;

function benchmark(name, operation) {
  // Warm up the operation before measuring it.
  for (let i = 0; i < WARMUP_ITERATIONS; i++) {
    operation(i);
  }

  const start = performance.now();

  for (let i = 0; i < ITERATIONS; i++) {
    operation(i);
  }

  const elapsed = performance.now() - start;
  const operationsPerSecond = ITERATIONS / (elapsed / 1000);

  console.log(`${name.padEnd(28)} ${operationsPerSecond.toFixed(0)} ops/sec`);
}

function createMap() {
  const map = new Map();

  for (let i = 0; i < 1000; i++) {
    map.set(`key-${i}`, i);
  }

  return map;
}

function createNanoCache(policy = 'lru') {
  const cache = createCache({
    maxEntries: 2000,
    defaultTtl: Infinity,
    evictionPolicy: policy,
  });

  for (let i = 0; i < 1000; i++) {
    cache.set(`key-${i}`, i);
  }

  return cache;
}

console.log('\nGET benchmark');
console.log('------------------------------');

const mapForGet = createMap();
const cacheForGet = createNanoCache();

benchmark('Native Map.get', (i) => {
  mapForGet.get(`key-${i % 1000}`);
});

benchmark('nano-cache LRU get', (i) => {
  cacheForGet.get(`key-${i % 1000}`);
});

console.log('\nSET benchmark');
console.log('------------------------------');

const mapForSet = new Map();
const cacheForSet = createNanoCache();

benchmark('Native Map.set', (i) => {
  mapForSet.set(`key-${i % 1000}`, i);
});

benchmark('nano-cache LRU set', (i) => {
  cacheForSet.set(`key-${i % 1000}`, i);
});

console.log('\nEviction policy benchmark');
console.log('------------------------------');

const policies = ['lru', 'lfu', 'fifo', 'lifo', 'mru', 'random'];

for (const policy of policies) {
  const cache = createCache({
    maxEntries: 1000,
    defaultTtl: Infinity,
    evictionPolicy: policy,
  });

  for (let i = 0; i < 1000; i++) {
    cache.set(`key-${i}`, i);
  }

  benchmark(`${policy.toUpperCase()} set + eviction`, (i) => {
    cache.set(`new-key-${i}`, i);
  });
}
