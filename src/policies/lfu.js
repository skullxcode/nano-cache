function createLfuPolicy() {
  const frequencies = new Map();
  const accessOrder = new Map();

  function onSet(key, isNew) {
    if (isNew) {
      frequencies.set(key, 0);
    }

    // A write makes the key recently used.
    accessOrder.delete(key);
    accessOrder.set(key, true);
  }

  function onGet(key) {
    if (!frequencies.has(key)) return;

    frequencies.set(key, frequencies.get(key) + 1);

    // Move key to the newest access position.
    accessOrder.delete(key);
    accessOrder.set(key, true);
  }

  function onDelete(key) {
    frequencies.delete(key);
    accessOrder.delete(key);
  }

  function evict() {
    if (frequencies.size === 0) return null;

    let lowestFrequency = Infinity;

    // Find the minimum access frequency.
    for (const frequency of frequencies.values()) {
      lowestFrequency = Math.min(lowestFrequency, frequency);
    }

    // Among equally frequent keys, choose the oldest access.
    for (const key of accessOrder.keys()) {
      if (frequencies.get(key) === lowestFrequency) {
        return key;
      }
    }

    return null;
  }

  function clear() {
    frequencies.clear();
    accessOrder.clear();
  }

  return {
    onSet,
    onGet,
    onDelete,
    evict,
    clear,
  };
}

module.exports = createLfuPolicy;
