import { connection } from 'next/server';

// Cache for frequently accessed data
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearCache(): void {
  cache.clear();
}

// Cache invalidation functions for specific data types
export function clearUserCache(): void {
  cache.delete('current-user');
}

export function clearMembersCache(groupId: string): void {
  cache.delete(`members-${groupId}`);
}

export function clearEventsCache(groupId: string): void {
  cache.delete(`events-${groupId}`);
  cache.delete('all-events');
}

export function clearEventCache(eventId: string): void {
  cache.delete(`event-${eventId}`);
}

export function clearGroupsCache(): void {
  // Clear all group-related caches
  const keysToDelete: string[] = [];
  for (const key of cache.keys()) {
    if (key.startsWith('events-') || key.startsWith('members-')) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => cache.delete(key));
}

// Clear all caches related to a specific group
export function clearGroupCache(groupId: string): void {
  clearMembersCache(groupId);
  clearEventsCache(groupId);
}

// Optimized data fetching with caching
export async function fetchWithCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  useCache: boolean = true
): Promise<T> {
  if (useCache) {
    const cached = getCachedData<T>(key);
    if (cached) return cached;
  }
  
  await connection();
  const data = await fetchFn();
  
  if (useCache) {
    setCachedData(key, data);
  }
  
  return data;
}

// Debounce function for search inputs
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
} 