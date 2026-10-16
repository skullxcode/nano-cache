function createLruPolicy() {
  const entries = new Map();

  function onSet(key) {
    // A write makes the key the most recently used.
    entries.delete(key);
    entries.set(key, true);
  }

  function onGet(key) {
    // Move the accessed key to the newest position.
    if (!entries.has(key)) return;

    entries.delete(key);
    entries.set(key, true);
  }

  function onDelete(key) {
    entries.delete(key);
  }

  function evict() {
    // The first Map key is the least recently used.
    const oldestKey = entries.keys().next();

    return oldestKey.done ? null : oldestKey.value;
  }

  function clear() {
    entries.clear();
  }

  return {
    onSet,
    onGet,
    onDelete,
    evict,
    clear,
  };
}

module.exports = createLruPolicy;
