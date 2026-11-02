declare function createCache<T = unknown>(options?: createCache.CacheOptions): createCache.Cache<T>;

declare namespace createCache {
  type EvictionPolicy = 'lru' | 'lfu' | 'fifo' | 'lifo' | 'mru' | 'random';

  interface CacheOptions {
    defaultTtl?: number;
    maxEntries?: number;
    evictionPolicy?: EvictionPolicy;
    clock?: () => number;
  }

  interface CacheStats {
    hits: number;
    misses: number;
    evictions: number;
    size: number;
    hitRate: number;
  }

  interface CacheSetResult<T> {
    key: string;
    value: T;
    expiresAt: number;
  }

  interface Cache<T> {
    set(key: string, value: T, customTtl?: number): CacheSetResult<T>;
    get(key: string): T | null;
    has(key: string): boolean;
    del(key: string): boolean;
    clear(): void;
    size(): number;
    stats(): CacheStats;
    resetStats(): void;
  }
}

export = createCache;
