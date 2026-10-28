function createLifoPolicy() {
  const entries = new Map();

  function onSet(key, isNew) {
    if (isNew) {
      entries.set(key, true);
    }
  }

  function onGet() {}

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

module.exports = createLifoPolicy;
