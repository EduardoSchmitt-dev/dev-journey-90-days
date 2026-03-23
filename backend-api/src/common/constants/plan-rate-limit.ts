export const PLAN_RATE_LIMIT = {
  FREE: {
    ttl: 60,
    limit: 5,
  },
  PRO: {
    ttl: 60,
    limit: 20,
  },
  ENTERPRISE: {
    ttl: 60,
    limit: 100,
  },
} as const;
