import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { JwtStrategy } from './jwt.strategy';
import { LoginUseCase } from './use-cases/login.use-case';
import { SecurityModule } from '../common/security/security.module'; 
import { RefreshTokenUseCase } from './use-cases/refresh-token.use-case';

@Module({
  imports: [ 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '15m' }, 
    }),
    SecurityModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LoginUseCase, RefreshTokenUseCase,
    {
      provide: 'IAuthRepository', 
      useClass: AuthRepository,
    },
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}