import { connection } from 'next/server';

// Server-side cache for data that needs to be invalidated
const serverCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_DURATION = 3 * 60 * 1000; // 3 minutes

export function getServerCachedData<T>(key: string): T | null {
  const cached = serverCache.get(key);
  if (!cached) return null;
  
  const now = Date.now();
  if (now - cached.timestamp > CACHE_DURATION) {
    serverCache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

export function setServerCachedData<T>(key: string, data: T): void {
  serverCache.set(key, { data, timestamp: Date.now() });
}

export function clearServerCache(): void {
  serverCache.clear();
}

// Cache invalidation functions for server-side use
export function clearServerUserCache(): void {
  serverCache.delete('current-user');
}

export function clearServerMembersCache(groupId: string): void {
  serverCache.delete(`members-${groupId}`);
}

export function clearServerEventsCache(groupId: string): void {
  serverCache.delete(`events-${groupId}`);
  serverCache.delete('all-events');
}

export function clearServerEventCache(eventId: string): void {
  serverCache.delete(`event-${eventId}`);
}

export function clearServerGroupsCache(): void {
  // Clear all group-related caches
  const keysToDelete: string[] = [];
  for (const key of serverCache.keys()) {
    if (key.startsWith('events-') || key.startsWith('members-')) {
      keysToDelete.push(key);
    }
  }
  keysToDelete.forEach(key => serverCache.delete(key));
}

// Clear all caches related to a specific group
export function clearServerGroupCache(groupId: string): void {
  clearServerMembersCache(groupId);
  clearServerEventsCache(groupId);
}

// Server-side data fetching with caching
export async function fetchWithServerCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  useCache: boolean = true
): Promise<T> {
  if (useCache) {
    const cached = getServerCachedData<T>(key);
    if (cached) return cached;
  }
  
  await connection();
  const data = await fetchFn();
  
  if (useCache) {
    setServerCachedData(key, data);
  }
  
  return data;
} 