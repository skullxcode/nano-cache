function createCache(options = {}) {
  const defaultTtl = options.defaultTtl || 60000;
  let cache = new Map();
  function set(key, value, customTtl) {
    if (typeof key !== 'string' || !key.trim()) {
      throw new TypeError('Cache key must be a non-empty string.');
    }
    const ttlToUse = customTtl !== undefined ? customTtl : defaultTtl;
    const entry = {
      value: value,
      expiresAt: Date.now() + ttlToUse,
    };
    cache.set(key, entry);
    return { key, ...entry };
  }

  function get(key) {
    if (typeof key !== 'string' || !key.trim()) {
      throw new TypeError('Cache key must be a non-empty string.');
    }
    const entry = cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      del(key);
      return null;
    }
    return entry.value;
  }

  function has(key) {
    if (typeof key !== 'string' || !key.trim()) {
      throw new TypeError('Cache key must be a non-empty string.');
    }
    const entry = cache.get(key);
    if (!entry || entry.expiresAt < Date.now()) {
      del(key);
      return false;
    }
    return true;
  }

  function del(key) {
    if (typeof key !== 'string' || !key.trim()) {
      throw new TypeError('Cache key must be a non-empty string.');
    }
    return cache.delete(key);
  }

  function clear() {
    cache.clear();
  }

  function size() {
    const now = Date.now();

    for (const [key, entry] of cache) {
      if (entry.expiresAt < now) {
        del(key);
      }
    }
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
