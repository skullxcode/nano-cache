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

module.exports = {
  validateOptions,
  validateTtl,
  validateKey,
};
