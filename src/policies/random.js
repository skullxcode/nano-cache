
function createRandomPolicy(random = Math.random) {
  const entries = new Set();

  function onSet(key) {
    entries.add(key);
  }

  function onGet() {}

  function onDelete(key) {
    entries.delete(key);
  }

  function evict() {
    if (entries.size === 0) return null;

    const keys = Array.from(entries);
    const index = Math.floor(random() * keys.length);

    return keys[index];
  }

  function clear() {
    entries.clear();
  }

  return { onSet, onGet, onDelete, evict, clear };
}

module.exports = createRandomPolicy;
