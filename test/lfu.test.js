const test = require('node:test');
const assert = require('node:assert/strict');

const createLfuPolicy = require('../src/policies/lfu');

test('evicts the least frequently used key', () => {
  const policy = createLfuPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);

  policy.onGet('a');
  policy.onGet('a');
  policy.onGet('c');

  assert.equal(policy.evict(), 'b');
});

test('uses LRU when frequencies are equal', () => {
  const policy = createLfuPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);

  policy.onGet('a');
  policy.onGet('b');

  // Both have frequency 1.
  // A was accessed before B.
  assert.equal(policy.evict(), 'a');
});

test('removes deleted keys from tracking', () => {
  const policy = createLfuPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onDelete('a');

  assert.equal(policy.evict(), 'b');
});

test('returns null when empty', () => {
  const policy = createLfuPolicy();

  assert.equal(policy.evict(), null);
});

test('clears all tracking data', () => {
  const policy = createLfuPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.clear();

  assert.equal(policy.evict(), null);
});
