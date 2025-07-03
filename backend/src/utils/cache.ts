import { UserWithPosts } from '../models/types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly defaultTTL: number;

  constructor(defaultTTL: number = 60000) { // 60 seconds default
    this.defaultTTL = defaultTTL;
    
    // Clean up expired entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  set(key: string, value: T, ttl?: number): void {
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    };
    
    this.cache.set(key, entry);
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }
}

// Create cache instance for users
const userCache = new SimpleCache<UserWithPosts>(60000); // 60 second TTL

export const getUserFromCache = (userId: number): UserWithPosts | null => {
  return userCache.get(`user:${userId}`);
};

export const setUserInCache = (userId: number, user: UserWithPosts): void => {
  userCache.set(`user:${userId}`, user);
};

export const clearUserFromCache = (userId: number): boolean => {
  return userCache.delete(`user:${userId}`);
};

export const clearAllUserCache = (): void => {
  userCache.clear();
};

export const getCacheStats = () => {
  return {
    size: userCache.size(),
    keys: userCache.keys()
  };
};