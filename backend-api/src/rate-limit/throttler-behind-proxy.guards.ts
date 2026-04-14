import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { RequestWithUser } from '../common/types/request-with-user';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const request = req as RequestWithUser;

    const forwardedFor = request.headers['x-forwarded-for'];

    const ip =
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : (request.socket?.remoteAddress ?? request.ip ?? 'unknown');

    return Promise.resolve(ip);
  }

  protected generateKey(
    context: ExecutionContext,
    tracker: string,
    throttlerName?: string,
  ): string {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const userId = request.user?.userId;

    const routeKey = `${request.method}:${request.originalUrl || request.url}`;

    if (userId) {
      return `rl:${throttlerName ?? 'default'}:u:${userId}:${routeKey}`;
    }

    return `rl:${throttlerName ?? 'default'}:ip:${tracker}:${routeKey}`;
  }
}
