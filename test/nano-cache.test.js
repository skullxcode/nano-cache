const test = require('node:test');
const assert = require('node:assert/strict');
const createCache = require('../index.js');

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