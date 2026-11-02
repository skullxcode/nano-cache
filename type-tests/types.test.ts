import createCache = require('../');

const cache = createCache<string>({
  maxEntries: 100,
  defaultTtl: 5000,
  evictionPolicy: 'lru',
});

cache.set('name', 'nano-cache');

const value: string | null = cache.get('name');
const exists: boolean = cache.has('name');
const count: number = cache.size();

const stats = cache.stats();
const hitRate: number = stats.hitRate;

cache.resetStats();
cache.del('name');
cache.clear();

// @ts-expect-error Unsupported eviction policy
createCache({ evictionPolicy: 'invalid' });

// @ts-expect-error Values must be strings
cache.set('age', 25);

void value;
void exists;
void count;
void hitRate;
