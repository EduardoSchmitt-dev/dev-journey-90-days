import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Request } from 'express';

import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { refreshTokenDto } from '../dto/refresh-token.dto'; // se você usa esse dto
import { IAuthRepository } from '../repositories/auth.repository.interface';

import { LoginUseCase } from '../use-cases/login.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logger: PinoLogger,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {
    this.logger.setContext(AuthService.name);
  }

  // ✅ Controller chama login(dto, req)
  async login(dto: LoginDto, req: Request) {
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

  async revokeSession(userId: number, jti: string) {
    const token = await this.authRepository.findRefreshTokenByJti(jti);
    if (!token || token.userId !== userId) {
      throw new Error('Access denied');
    }
    return this.authRepository.revokeSession(jti);
  }

  async logout(userId: number) {
    await this.authRepository.logoutAll(userId);
    return { message: 'Logged out successfully' };
  }
}