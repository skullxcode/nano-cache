function validateOptions(options) {
  if (options === null || typeof options !== 'object' || Array.isArray(options)) {
    throw new TypeError('Options must be a valid object');
  }
}

function validateTtl(ttl, name = 'TTL') {
  if (typeof ttl !== 'number' || Number.isNaN(ttl)) {
    throw new TypeError(`${name} must be a number`);
  }

  if (ttl < 0) {
    throw new RangeError(`${name} cannot be negative`);
  }
}

function validateKey(key) {
  if (typeof key !== 'string' || !key.trim()) {
    throw new TypeError('Cache key must be a non-empty string.');
  }
}

function createCache(options = {}) {
  validateOptions(options);

  const defaultTtl = options.defaultTtl === undefined ? 60000 : options.defaultTtl;

  validateTtl(defaultTtl, 'Default TTL');

  const clock = options.clock === undefined ? Date.now : options.clock;

  if (typeof clock !== 'function') {
    throw new TypeError('Clock must be a function');
  }

  const cache = new Map();

  function isExpired(entry, now = clock()) {
    return entry.expiresAt !== Infinity && entry.expiresAt <= now;
  }

  function removeExpiredEntries() {
    const now = clock();

    for (const [key, entry] of cache) {
      if (isExpired(entry, now)) {
        cache.delete(key);
      }
    }
  }

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

    if (!entry || isExpired(entry)) {
      cache.delete(key);
      return null;
    }

    return entry.value;
  }

  function has(key) {
    validateKey(key);

    const entry = cache.get(key);

    if (!entry || isExpired(entry)) {
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
    removeExpiredEntries();
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
