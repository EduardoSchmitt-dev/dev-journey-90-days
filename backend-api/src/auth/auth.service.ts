import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(AuthService.name);
  }


  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
 
  async login(dto: LoginDto) {
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  const passwordValid = await this.comparePassword(
    dto.password,
    user.password,
  );

  if (!passwordValid) {
    throw new UnauthorizedException('Invalid credentials');
  }

  // 🔥 GERAR JTI NOVO
  const refreshJti = randomUUID();

  const payload = {
    sub: user.id,
    email: user.email,
    jti: refreshJti,
  };

  const access_token = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  const refresh_token = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  const hashedRefreshToken = await this.hashPassword(refresh_token);

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
      refreshTokenJti: refreshJti,
    },
  });

  return {
    access_token,
    refresh_token,
 };
}


  async register(data: RegisterDto) {
  const hashedPassword = await this.hashPassword(data.password);

  const freePlan = await this.prisma.plan.findUnique({
    where: { name: 'Free' },
  });

  if (!freePlan) {
    throw new Error('Free plan not found');
  }

  const user = await this.prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      planId: freePlan.id,
    },
  });

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
}

  async refreshToken(refreshToken: string) {
  try {
    // 🔐 1️⃣ Verifica assinatura
    const decoded = this.jwtService.verify(refreshToken);

    const { sub: userId, jti } = decoded;

    // 🔎 2️⃣ Busca usuário
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.refreshToken || !user.refreshTokenJti) {
      throw new UnauthorizedException('Access denied');
    }

    // 🔥 3️⃣ VALIDA JTI (ANTI-REPLAY REAL)
    if (user.refreshTokenJti !== jti) {
      throw new UnauthorizedException('Refresh token revoked');
    }

    // 🔒 4️⃣ VALIDA HASH
    const isValid = await this.comparePassword(
      refreshToken,
      user.refreshToken,
    );

    if (!isValid) {
      throw new UnauthorizedException('Access denied');
    }

    // 🔁 5️⃣ ROTACIONA TOKEN
    const newRefreshJti = randomUUID();

    const newPayload = {
      sub: user.id,
      email: user.email,
      jti: newRefreshJti,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });

    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    const hashedRefreshToken = await this.hashPassword(newRefreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: hashedRefreshToken,
        refreshTokenJti: newRefreshJti,
      },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  } catch (error) {
    throw new UnauthorizedException('Access denied');
  }
}


  async logout(userId: number) {
  await this.prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
 }

}
