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
    jti: refreshJti, //
  };

  const access_token = this.jwtService.sign(payload, {
    expiresIn: '15m',
  });

  const refresh_token = this.jwtService.sign(payload, {
    expiresIn: '7d',
  });

  const hashedRefreshToken = await this.hashPassword(refresh_token);

const familyId = randomUUID();

await this.prisma.refreshToken.create({
  data: {
    userId: user.id,
    hashedToken: hashedRefreshToken,
    jti: refreshJti,
    familyId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
    const decoded = this.jwtService.verify(refreshToken);
    const { sub: userId, jti } = decoded;

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { jti },
    });


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

      await this.prisma.refreshToken.updateMany({
        where: { familyId: storedToken.familyId },
        data: { revokedAt: new Date() },
      });

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
    await this.prisma.refreshToken.update({
      where: { jti: storedToken.jti },
      data: {
        revokedAt: new Date(),
        replacedByJti: newRefreshJti,
      },
    });

    // cria novo token filho
    await this.prisma.refreshToken.create({
      data: {
        userId,
        hashedToken: hashedNewRefreshToken,
        jti: newRefreshJti,
        familyId: storedToken.familyId,
        parentJti: storedToken.jti,
        expiresAt: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ),
      },
    });

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  } catch {
    throw new UnauthorizedException('Access denied');
  }
}



  async logout(userId: number) {
  await this.prisma.refreshToken.updateMany({
    where: { 
      userId, 
      revokedAt: null,
    },
    data: { 
      revokedAt: new Date(),
    },
  });

  return { message: 'Logged out successfully' };
 }

}
