function isExpired(entry, now) {
  return entry.expiresAt !== Infinity && entry.expiresAt <= now;
}

function removeExpiredEntries(cache, clock, onExpire = () => {}) {
  const now = clock();

  for (const [key, entry] of cache) {
    if (isExpired(entry, now)) {
      cache.delete(key);
      onExpire(key);
    }
  }
}

module.exports = {
  isExpired,
  removeExpiredEntries,
};
