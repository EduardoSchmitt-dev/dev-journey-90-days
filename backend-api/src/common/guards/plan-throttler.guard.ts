import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { PLAN_RATE_LIMITS } from '../constants/rate-limit.constants';
import { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class PlanThrottlerGuard extends ThrottlerGuard {
  protected async handleRequest(
    requestProps: ThrottlerRequest,
  ): Promise<boolean> {
    const { context, throttler, blockDuration, getTracker, generateKey } =
      requestProps;

    const { req, res } = this.getRequestResponse(context) as {
      req: Request;
      res: Response;
    };

    const request = req as AuthenticatedRequest;

    const planName = request.user?.plan?.toUpperCase();
    const planRate =
      PLAN_RATE_LIMITS[planName as keyof typeof PLAN_RATE_LIMITS] ??
      PLAN_RATE_LIMITS.DEFAULT;

    const tracker = await getTracker(req, context);
    const throttlerName = throttler.name ?? 'default';
    const key = generateKey(context, tracker, throttlerName);

    const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } =
      await this.storageService.increment(
        key,
        planRate.ttl,
        planRate.limit,
        blockDuration,
        throttlerName,
      );

    const suffix = throttlerName === 'default' ? '' : `-${throttlerName}`;

    res.header(`${this.headerPrefix}-Limit${suffix}`, String(planRate.limit));
    res.header(
      `${this.headerPrefix}-Remaining${suffix}`,
      String(Math.max(0, planRate.limit - totalHits)),
    );
    res.header(`${this.headerPrefix}-Reset${suffix}`, String(timeToExpire));

    if (isBlocked) {
      res.header(`Retry-After${suffix}`, String(timeToBlockExpire));

      await this.throwThrottlingException(context, {
        limit: planRate.limit,
        ttl: planRate.ttl,
        key,
        tracker,
        totalHits,
        timeToExpire,
        isBlocked,
        timeToBlockExpire,
      });
    }

    return true;
  }

  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const request = req as unknown as AuthenticatedRequest;

    if (request.user?.userId) {
      return Promise.resolve(`user:${request.user.userId}`);
    }

    if (typeof request.ip === 'string') {
      return Promise.resolve(`ip:${request.ip}`);
    }

    return Promise.resolve('ip:unknown');
  }
}
