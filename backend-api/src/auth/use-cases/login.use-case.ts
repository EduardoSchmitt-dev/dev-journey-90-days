import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as crypto from 'crypto';
import { ProgressiveLockService } from '../../common/security/progressive-lock.service';
import { IAuthRepository } from '../repositories/auth.repository.interface';
import { LoginDto } from '../dto/login.dto';

export class LoginUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly progressiveLock: ProgressiveLockService,
     ) {}

  private generateDeviceHash(ip?: string, userAgent?: string) {
    const raw = `${ip || 'unknown'}|${userAgent || 'unknown'}|${process.env.JWT_SECRET}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
  }

  async execute(dto: LoginDto, req: Request) {
  const identifier = dto.email;

  console.log('📌 LOGIN ATTEMPT EMAIL:', dto.email);

  await this.progressiveLock.checkLock(identifier);

  const user = await this.authRepository.findUserByEmail(dto.email);

  console.log('📌 USER FROM DB:', user);

  if (!user) {
    await this.progressiveLock.registerFailure(identifier);
    throw new UnauthorizedException('Invalid credentials');
  }

  console.log('📌 STORED HASH:', user.password);
  console.log('📌 PASSWORD RECEIVED:', dto.password);

  const passwordValid = await bcrypt.compare(
    dto.password,
    user.password
  );

  console.log('📌 PASSWORD VALID?', passwordValid);

  if (!passwordValid) {
    await this.progressiveLock.registerFailure(identifier);
    throw new UnauthorizedException('Invalid credentials');
  }

  const refreshJti = randomUUID();
  const familyId = randomUUID();

  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,   // 👈 precisa existir
    jti: refreshJti,
  };

  const access_token = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  const refresh_token = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  await this.authRepository.createRefreshToken({
    userId: user.id,
    hashedToken: await bcrypt.hash(refresh_token, 10),
    jti: refreshJti,
    familyId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'] as string,
    deviceHash: this.generateDeviceHash(
      req.ip,
      req.headers['user-agent'] as string
    ),
  });

  await this.progressiveLock.reset(identifier);

  return { access_token, refresh_token };
}
}