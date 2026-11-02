const test = require('node:test');
const assert = require('node:assert/strict');

const createFifoPolicy = require('../src/policies/fifo');
const createLifoPolicy = require('../src/policies/lifo');
const createMruPolicy = require('../src/policies/mru');
const createRandomPolicy = require('../src/policies/random');

test('FIFO evicts the first inserted key', () => {
  const policy = createFifoPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);
  policy.onGet('a');

  assert.equal(policy.evict(), 'a');
});

test('FIFO preserves insertion order on update', () => {
  const policy = createFifoPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('a', false);

  assert.equal(policy.evict(), 'a');
});

test('LIFO evicts the last inserted key', () => {
  const policy = createLifoPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);

  assert.equal(policy.evict(), 'c');
});

test('LIFO ignores reads', () => {
  const policy = createLifoPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onGet('a');

  assert.equal(policy.evict(), 'b');
});

test('MRU evicts the most recently accessed key', () => {
  const policy = createMruPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);

  policy.onGet('a');

  assert.equal(policy.evict(), 'a');
});

test('MRU considers writes recent', () => {
  const policy = createMruPolicy();

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('a', false);

  assert.equal(policy.evict(), 'a');
});

test('Random selects a tracked key', () => {
  const policy = createRandomPolicy(() => 0);

  policy.onSet('a', true);
  policy.onSet('b', true);
  policy.onSet('c', true);

  assert.equal(policy.evict(), 'a');
});

test('Random returns null when empty', () => {
  const policy = createRandomPolicy();

  assert.equal(policy.evict(), null);
});

test('All policies clean up deleted entries', () => {
  const policies = [
    createFifoPolicy(),
    createLifoPolicy(),
    createMruPolicy(),
    createRandomPolicy(),
  ];

  for (const policy of policies) {
    policy.onSet('a', true);
    policy.onSet('b', true);
    policy.onDelete('b');

    assert.equal(policy.evict(), 'a');

    policy.clear();
    assert.equal(policy.evict(), null);
  }
});
