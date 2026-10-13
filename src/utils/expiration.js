function isExpired(entry, now) {
  return entry.expiresAt !== Infinity && entry.expiresAt <= now;
}

function removeExpiredEntries(cache, clock) {
  const now = clock();

  for (const [key, entry] of cache) {
    if (isExpired(entry, now)) {
      cache.delete(key);
    }
  }
}

module.exports = {
  isExpired,
  removeExpiredEntries,
};
