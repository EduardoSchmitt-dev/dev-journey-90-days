import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { LoginUseCase } from './use-cases/login.use-case';
import { SecurityModule } from '../common/security/security.module';
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase,
    RefreshTokenUseCase,
    {
      provide: 'IAuthRepository',
      useClass: AuthRepository,
    },
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
