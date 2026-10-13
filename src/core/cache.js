const { validateOptions, validateTtl, validateKey } = require('../utils/validators');

const { isExpired, removeExpiredEntries } = require('../utils/expiration');

function createCache(options = {}) {
  validateOptions(options);

  const defaultTtl = options.defaultTtl === undefined ? 60000 : options.defaultTtl;

  validateTtl(defaultTtl, 'Default TTL');

  const clock = options.clock === undefined ? Date.now : options.clock;

  if (typeof clock !== 'function') {
    throw new TypeError('Clock must be a function');
  }

  const cache = new Map();

  function set(key, value, customTtl) {
    validateKey(key);

    const ttlToUse = customTtl === undefined ? defaultTtl : customTtl;

    validateTtl(ttlToUse, 'TTL');

    const now = clock();

    const entry = {
      value,
      expiresAt: ttlToUse === Infinity ? Infinity : now + ttlToUse,
    };

    cache.set(key, entry);

    return { key, ...entry };
  }

  function get(key) {
    validateKey(key);

    const entry = cache.get(key);

    if (!entry || isExpired(entry, clock())) {
      cache.delete(key);
      return null;
    }

    return entry.value;
  }

  function has(key) {
    validateKey(key);

    const entry = cache.get(key);

    if (!entry || isExpired(entry, clock())) {
      cache.delete(key);
      return false;
    }

    return true;
  }

  function del(key) {
    validateKey(key);
    return cache.delete(key);
  }

  function clear() {
    cache.clear();
  }

  function size() {
    removeExpiredEntries(cache, clock);
    return cache.size;
  }

  return {
    set,
    get,
    has,
    del,
    clear,
    size,
  };
}

module.exports = createCache;
