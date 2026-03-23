import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { PLAN_RATE_LIMIT } from '../constants/plan-rate-limit';
import { AuthUser } from '../../auth/interfaces/auth-user.interface';

type AuthenticatedRequest = Request & {
  user?: AuthUser;
};

@Injectable()
export class PlanThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const ip = req['ip'];

    if (typeof ip === 'string') {
      return Promise.resolve(ip);
    }

    return Promise.resolve('unknown');
  }

  protected getLimit(context: ExecutionContext): Promise<number> {
    const request = this.getRequestResponse(context)
      .req as AuthenticatedRequest;
    const user = request.user;

    if (!user || !user.plan) {
      return Promise.resolve(PLAN_RATE_LIMIT.FREE.limit);
    }

    const planName = user.plan.toUpperCase();

    return Promise.resolve(
      PLAN_RATE_LIMIT[planName as keyof typeof PLAN_RATE_LIMIT]?.limit ??
        PLAN_RATE_LIMIT.FREE.limit,
    );
  }

  protected getTtl(context: ExecutionContext): Promise<number> {
    const request = this.getRequestResponse(context)
      .req as AuthenticatedRequest;
    const user = request.user;

    if (!user || !user.plan) {
      return Promise.resolve(PLAN_RATE_LIMIT.FREE.ttl);
    }

    const planName = user.plan.toUpperCase();

    return Promise.resolve(
      PLAN_RATE_LIMIT[planName as keyof typeof PLAN_RATE_LIMIT]?.ttl ??
        PLAN_RATE_LIMIT.FREE.ttl,
    );
  }
}
