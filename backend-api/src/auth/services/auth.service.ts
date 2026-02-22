import * as bcrypt from 'bcrypt';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from '../dto/login.dto';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import * as crypto from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';
import { IAuthRepository } from '../repositories/auth.repository.interface';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
  ) {
    this.logger.setContext(AuthService.name);
  }

  private generateDeviceHash(ip?: string, userAgent?: string) {
    const raw = `${ip || 'unknown'}|${userAgent || 'unknown'}|${process.env.JWT_SECRET}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async login(dto: LoginDto, req: Request) {
    const user = await this.authRepository.findUserByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.comparePassword(dto.password, user.password);
    if (!passwordValid) {
      const attempts = user.failedLoginAttempts + 1;
      const lockUntil = attempts >= 5
        ? new Date(Date.now() + 15 * 60 * 1000)
        : null;

      await this.authRepository.updateUser(user.id, {
        failedLoginAttempts: attempts,
        lockUntil,
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    await this.authRepository.updateUser(user.id, {
      failedLoginAttempts: 0,
      lockUntil: null,
    });

    const refreshJti = randomUUID();
    const familyId = randomUUID();

    const payload = {
      sub: user.id,
      email: user.email,
      jti: refreshJti,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    const hashedRefreshToken = await this.hashPassword(refresh_token);

    await this.authRepository.createRefreshToken({
      userId: user.id,
      hashedToken: hashedRefreshToken,
      jti: refreshJti,
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'] as string,
      deviceHash: this.generateDeviceHash(req.ip, req.headers['user-agent'] as string),
    });

    return { access_token, refresh_token };
  }

  async register(data: RegisterDto) {
    const hashedPassword = await this.hashPassword(data.password);

    const freePlan = await this.authRepository.findPlanByName('Free');
    if (!freePlan) throw new Error('Free plan not found');

    const user = await this.authRepository.createUser({
      email: data.email,
      password: hashedPassword,
      planId: freePlan.id,
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

 async refreshToken(refreshToken: string, req: Request) {
  try {
    const decoded = this.jwtService.verify(refreshToken);
    const { sub: userId, jti } = decoded;

    const storedToken = await this.authRepository.findRefreshTokenByJti(jti);
  
    


    if (!storedToken) {
      throw new UnauthorizedException('Access denied');
    }

    // valida expiração no banco
    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expired ');
    }
    
    // 🔥 REUSE DETECTION
    if (storedToken.revokedAt || storedToken.replacedByJti) {

      this.logger.warn(`Token reuse detected for user ${userId}`);
      this.logger.warn(`User ${userId} revoked session ${jti}`);


await this.authRepository.revokeFamilyTokens(storedToken.familyId);

      throw new UnauthorizedException('Token reuse detected');
    }

    // 🔐 VALIDAR HASH
    const isValid = await this.comparePassword(
      refreshToken,
      storedToken.hashedToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Access denied');
    }

    // 🔄 ROTACIONAR
    const newRefreshJti = randomUUID();

    const newPayload = {
      sub: userId,
      email: decoded.email,
      jti: newRefreshJti,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    const hashedNewRefreshToken =
      await this.hashPassword(newRefreshToken);

    // marca o antigo como usado
    await this.authRepository.revokeToken(storedToken.jti, newRefreshJti);

    // cria novo token filho
    await this.authRepository.createRefreshToken({
  userId,
  hashedToken: hashedNewRefreshToken,
  jti: newRefreshJti,
  familyId: storedToken.familyId,
  parentJti: storedToken.jti,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
});

    const currentDeviceHash = this.generateDeviceHash(
     req.ip,
     req.headers['user-agent'] as string
 );

  if (storedToken.deviceHash && storedToken.deviceHash !== currentDeviceHash) {
  this.logger.warn(`Device mismatch for user ${userId}`);
 

    }
    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  } catch {
    throw new UnauthorizedException('Access denied');
  }
}

async getActiveSessions(userId: number) {
  return this.authRepository.findActiveSessions(userId);
}

  async revokeSession(userId: number, jti: string) {
  const token = await this.authRepository.findRefreshTokenByJti(jti);

  if (!token) throw new UnauthorizedException('Session not found');

  if (token.userId !== userId) {
    throw new UnauthorizedException('Access denied');
  }

  await this.authRepository.revokeSession(jti);

  return { message: 'Session revoked successfully' };
}



  //CRIAR UM MÉTODO TEMPORÁRIO DE RESET ????? NO AUTH SERVICE 


  async logout(userId: number) {
  await this.authRepository.logoutAll(userId);

  this.logger.warn(`User ${userId} performed global logout`);

  return { message: 'Logged out successfully' };
 }
}