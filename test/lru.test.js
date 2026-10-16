
const test = require('node:test');
const assert = require('node:assert/strict');

const createLruPolicy = require('../src/policies/lru');

test('evicts the least recently used key', () => {
  const policy = createLruPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);

  policy.onGet('a');

  assert.equal(policy.evict(), 'b');
});

test('updates recency when a key is accessed', () => {
  const policy = createLruPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);

  policy.onGet('a');

  assert.equal(policy.evict(), 'b');
});

test('removes deleted keys from policy tracking', () => {
  const policy = createLruPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);

  policy.onDelete('a');

  assert.equal(policy.evict(), 'b');
});

test('returns null when policy is empty', () => {
  const policy = createLruPolicy();

  assert.equal(policy.evict(), null);
});

test('clears policy tracking', () => {
  const policy = createLruPolicy();

  policy.onSet('a', true);
  policy.clear();

  assert.equal(policy.evict(), null);
});
