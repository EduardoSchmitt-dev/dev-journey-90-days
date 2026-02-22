import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ThrottlerBehindProxyGuard } from './throttler-behind-proxy.guards'; 

@Module({
  imports: [
    ThrottlerModule.forRoot([
      // ✅ Global default (para tudo)
      { name: 'global', ttl: 60_000, limit: 120 },
    ]),
  ],
  providers: [
    // ✅ usa nosso guard que respeita proxy + key inteligente
    { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
  ],
})
export class RateLimitModule {}