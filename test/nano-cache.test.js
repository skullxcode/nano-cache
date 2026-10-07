const test = require('node:test');
const assert = require('node:assert/strict');
const createCache = require('../index.js');

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

test('creates a cache', () => {
  const cache = createCache();

  assert.equal(typeof cache.set, 'function');
  assert.equal(typeof cache.get, 'function');
  assert.equal(typeof cache.has, 'function');
});

test('sets and gets a string value', () => {
  const cache = createCache();

  cache.set('greeting', 'hello');

  assert.equal(cache.get('greeting'), 'hello');
});

test('sets and gets a number', () => {
  const cache = createCache();

  cache.set('answer', 42);

  assert.equal(cache.get('answer'), 42);
});

test('has returns true for an existing key', () => {
  const cache = createCache();
  cache.set('name', 'nano-cache');

  assert.equal(cache.has('name'), true);
});

test('has returns false for a missing key', () => {
  const cache = createCache();

  assert.equal(cache.has('missing'), false);
});

test('deletes an existing key', () => {
  const cache = createCache();
  cache.set('temporary', 'value');

  assert.equal(cache.del('temporary'), true);
  assert.equal(cache.has('temporary'), false);
});

test('gets null for a missing key', () => {
  const cache = createCache();

  assert.equal(cache.get('missing'), null);
});

test('clears the cache', () => {
  const cache = createCache();
  cache.set('first', 1);
  cache.set('second', 2);

  cache.clear();

  assert.equal(cache.get('first'), null);
  assert.equal(cache.get('second'), null);
});

test('reports the cache size', () => {
  const cache = createCache();
  cache.set('first', 1);
  cache.set('second', 2);

  assert.equal(cache.size(), 2);
});

test('keeps an entry available before its TTL expires', () => {
  const cache = createCache();
  cache.set('temporary', 'value', 50);

  assert.equal(cache.get('temporary'), 'value');
});

test('makes an entry unavailable after its TTL expires', async () => {
  const cache = createCache();
  cache.set('temporary', 'value', 10);

  await delay(20);

  assert.equal(cache.get('temporary'), null);
});

test('expires an entry according to its custom TTL', async () => {
  const cache = createCache();
  cache.set('short-lived', 'short', 10);
  cache.set('longer-lived', 'longer', 100);

  await delay(20);

  assert.equal(cache.get('short-lived'), null);
  assert.equal(cache.get('longer-lived'), 'longer');
});

test('expires an entry with TTL zero immediately', async () => {
  const cache = createCache();
  cache.set('immediate', 'value', 0);

  await delay(0);

  assert.equal(cache.get('immediate'), null);
});

test('does not report an expired entry with has', async () => {
  const cache = createCache();
  cache.set('temporary', 'value', 10);

  await delay(20);

  assert.equal(cache.has('temporary'), false);
});

test('does not count expired entries in size', async () => {
  const cache = createCache();
  cache.set('temporary', 'value', 10);

  await delay(20);

  assert.equal(cache.size(), 0);
});