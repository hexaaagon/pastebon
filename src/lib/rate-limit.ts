import { LRUCache } from "lru-cache";

export default function rateLimit(options?: {
  uniqueTokenPerInterval?: number;
  interval?: number;
}) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 5,
    ttl: options?.interval || 1 * 60 * 60 * 1000,
  });

  return {
    reset: () => {
      tokenCache.clear();
    },
    check: (limit: number, token: string) => {
      const tokenCount = (tokenCache.get(token) as number[]) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= limit;

      return {
        rateLimited: isRateLimited,
        limit: limit,
        remaining: isRateLimited ? 0 : limit - currentUsage,
        token: token,
      };
    },
  };
}
