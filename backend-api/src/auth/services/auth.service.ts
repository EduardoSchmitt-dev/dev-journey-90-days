import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import { Request } from 'express';

import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { IAuthRepository } from '../repositories/auth.repository.interface';

import { LoginUseCase } from '../use-cases/login.use-case';

@Injectable()
export class AuthService {
  constructor(
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
    private readonly loginUseCase: LoginUseCase,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {
    this.logger.setContext(AuthService.name);
  }

  // ✅ Controller chama login(dto, req)
  async login(dto: LoginDto, req: Request) 
  { this.logger.info(
  { requestId: req['requestId'],
    email: dto.email,
    ip: req.ip,
    userAgent: String(req.headers['user-agent']),
  },
  'Login attempt',
  );
    return this.loginUseCase.execute(dto, req);
  }

  async register(data: RegisterDto) {
    // aqui você ainda não tem RegisterUseCase, então mantém no service por enquanto
    // (depois no dia 48/49 você extrai para use-case)
    return this.authRepository.createUser(data); // ⚠️ se data não tiver planId/senha hash, isso precisa de use-case
  }

  async refreshToken(refreshToken: string, req: Request) {
    // quando você criar RefreshTokenUseCase, você move pra lá
    // por ora, deixa a lógica no AuthService (ou cria use-case já)
    throw new Error('refreshToken ainda não foi migrado para use-case');
  }

  async getActiveSessions(userId: number) {
  return this.authRepository.findActiveSessions(userId);
  }

  async revokeSession(userId: number, jti: string)  { 
    this.logger.warn(
   {
    userId,
    jti,
   },
  'Session revoked',
   );
    const token = await this.authRepository.findRefreshTokenByJti(jti); 
    if (!token || token.userId !== userId ) {
      this.logger.warn(
    {
    attemptedUserId: userId,
    tokenUserId: token?.userId,
    jti,
    },
    'Unauthorized revoke attempt',
    );
      throw new Error('Access denied');
    } 
    return this.authRepository.revokeSession(jti);
  }

  async logout(userId: number) {
    await this.authRepository.logoutAll(userId);
    this.logger.info(
  { userId },
  'User logout',
  );
    return { message: 'Logged out successfully' };
  }
}