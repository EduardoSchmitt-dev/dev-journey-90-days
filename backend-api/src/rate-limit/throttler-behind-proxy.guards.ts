import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { ExecutionContext } from '@nestjs/common';

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  /**
   * ✅ Pega IP real por trás de proxy (Render, Nginx, Cloudflare, etc.)
   */
protected async getTracker(req: Record<string, any>): Promise<string> {    
    const xff = (req.headers?.['x-forwarded-for'] as string | undefined) ?? '';
    const ipFromXff = xff.split(',')[0]?.trim();
    
    const ip =
      ipFromXff ||
      req.ip ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      'unknown';

    return ip;
  }

  /**
   * ✅ Key inteligente:
   * - se logado: rate limit por userId + rota (muito melhor)
   * - se não logado: por IP + rota
   */
  protected generateKey(
    context: ExecutionContext,
    tracker: string,
    throttlerName?: string,
  ): string {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id ?? req.user?.sub; // compatível com JWT payloads comuns
    const routeKey = `${req.method}:${req.originalUrl || req.url}`;

    if (userId) return `rl:${throttlerName ?? 'default'}:u:${userId}:${routeKey}`;
    return `rl:${throttlerName ?? 'default'}:ip:${tracker}:${routeKey}`;
  }
}