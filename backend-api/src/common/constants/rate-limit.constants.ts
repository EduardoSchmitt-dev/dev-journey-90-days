export const PLAN_RATE_LIMITS = {
  FREE: { limit: 5, ttl: 60000 },
  PRO: { limit: 20, ttl: 60000 },
  DEFAULT: { limit: 5, ttl: 60000 },
} as const;
