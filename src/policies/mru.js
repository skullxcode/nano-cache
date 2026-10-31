function createMruPolicy() {
  const entries = new Map();

  function markRecent(key) {
    if (!entries.has(key)) return;

    entries.delete(key);
    entries.set(key, true);
  }

  function onSet(key) {
    entries.delete(key);
    entries.set(key, true);
  }

  function onGet(key) {
    markRecent(key);
  }

  function onDelete(key) {
    entries.delete(key);
  }

  function evict() {
    let newestKey = null;

    for (const key of entries.keys()) {
      newestKey = key;
    }

    return newestKey;
  }

  function clear() {
    entries.clear();
  }

  return { onSet, onGet, onDelete, evict, clear };
}

module.exports = createMruPolicy;
