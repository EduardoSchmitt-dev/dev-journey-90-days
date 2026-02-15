import { SetMetadata } from '@nestjs/common';

export const PLAN_LIMIT_KEY = 'plan_limit';

export const PlanLimit = (limit: number) =>
  SetMetadata(PLAN_LIMIT_KEY, limit);
