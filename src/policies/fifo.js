function createFifoPolicy() {
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
    const oldest = entries.keys().next();
    return oldest.done ? null : oldest.value;
  }

  function clear() {
    entries.clear();
  }

  return { onSet, onGet, onDelete, evict, clear };
}

module.exports = createFifoPolicy;
