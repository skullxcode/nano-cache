const { validateOptions, validateTtl, validateKey } = require('../utils/validators');

const { isExpired, removeExpiredEntries } = require('../utils/expiration');

const createPolicy = require('../policies/policy-factory');

function createCache(options = {}) {
  validateOptions(options);

  const defaultTtl = options.defaultTtl === undefined ? 60000 : options.defaultTtl;

  validateTtl(defaultTtl, 'Default TTL');

  const clock = options.clock === undefined ? Date.now : options.clock;

  if (typeof clock !== 'function') {
    throw new TypeError('Clock must be a function');
  }

  const maxEntries = options.maxEntries === undefined ? Infinity : options.maxEntries;

  if (
    typeof maxEntries !== 'number' ||
    (maxEntries !== Infinity && (!Number.isInteger(maxEntries) || maxEntries <= 0))
  ) {
    throw new RangeError('maxEntries must be a positive integer');
  }

  const policyName = options.evictionPolicy === undefined ? 'lru' : options.evictionPolicy;

  const policy = createPolicy(policyName);

  const cache = new Map();

  let hits = 0;
  let misses = 0;
  let evictions = 0;

  function removeEntry(key) {
    const deleted = cache.delete(key);

    if (deleted) {
      policy.onDelete(key);
    }

    return deleted;
  }

  function cleanupExpiredEntries() {
    removeExpiredEntries(cache, clock, (key) => {
      policy.onDelete(key);
    });
  }

  function set(key, value, customTtl) {
    validateKey(key);

    const ttlToUse = customTtl === undefined ? defaultTtl : customTtl;

    validateTtl(ttlToUse, 'TTL');

    cleanupExpiredEntries();

    const existingEntry = cache.get(key);
    const isNew = !existingEntry;

    if (isNew && cache.size >= maxEntries) {
      const keyToEvict = policy.evict();

      if (keyToEvict === null || !cache.has(keyToEvict)) {
        throw new Error('Eviction policy returned an invalid key');
      }

      removeEntry(keyToEvict);
      evictions++;
    }

    const now = clock();

    const entry = {
      value,
      expiresAt: ttlToUse === Infinity ? Infinity : now + ttlToUse,
    };

    cache.set(key, entry);

    policy.onSet(key, isNew);

    return { key, ...entry };
  }

  function get(key) {
    validateKey(key);

    const entry = cache.get(key);

    if (!entry || isExpired(entry, clock())) {
      removeEntry(key);
      misses++;
      return null;
    }

    hits++;
    policy.onGet(key);

    return entry.value;
  }

  function has(key) {
    validateKey(key);

    const entry = cache.get(key);

    if (!entry || isExpired(entry, clock())) {
      removeEntry(key);
      return false;
    }

    return true;
  }

  function del(key) {
    validateKey(key);
    return removeEntry(key);
  }

  function clear() {
    cache.clear();
    policy.clear();
  }

  function size() {
    cleanupExpiredEntries();
    return cache.size;
  }

  function stats() {
    const currentSize = size();
    const totalRequests = hits + misses;
    const hitRate = totalRequests === 0 ? 0 : hits / totalRequests;

    return {
      hits,
      misses,
      evictions,
      size: currentSize,
      hitRate,
    };
  }

  function resetStats() {
    hits = 0;
    misses = 0;
    evictions = 0;
  }

  return {
    set,
    get,
    has,
    del,
    clear,
    size,
    stats,
    resetStats,
  };
}

module.exports = createCache;
