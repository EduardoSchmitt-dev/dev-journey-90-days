import * as bcrypt from 'bcrypt';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PinoLogger } from 'nestjs-pino';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setContext(AuthService.name);
  }

  private generateDeviceHash
  (ip: string | undefined,
   userAgent: string | undefined
  ) {
    const raw = `${ip || 'unknown'} |${userAgent || 'unknown'}|${process.env.JWT_SECRET}`;
    return crypto.createHash('sha256').update(raw).digest('hex');
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
 
  async login(dto: LoginDto, req: Request) { //busca o usuário
  const user = await this.prisma.user.findUnique({
    where: { email: dto.email },
  });


 if (!user) {
  throw new UnauthorizedException('Invalid credentials');
 }

  // 🔒 Verifica se conta está bloqueada
  if (user.lockUntil && user.lockUntil > new Date()) {
  this.logger.warn(`Blocked login attempt for locked user ${user.id}`);
  throw new UnauthorizedException('Invalid credentials');
  }

  const passwordValid = await this.comparePassword(
  dto.password,
  user.password,
);

if (!passwordValid) {
  const attempts = user.failedLoginAttempts + 1;

  let lockUntil: Date | null = null;

  if (attempts >= 5) {
    lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  await this.prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: attempts,
      lockUntil,
    },
  });

  this.logger.warn(`Invalid login attempt ${attempts} for user ${user.id}`);

  throw new UnauthorizedException('Invalid credentials');
}

// ✅ RESET SOMENTE AQUI (senha válida)
await this.prisma.user.update({
  where: { id: user.id },
  data: {
    failedLoginAttempts: 0,
    lockUntil: null,
  },
});

  // 🔥 GERAR JTI NOVO/gerar tokens
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

const deviceHash = this.generateDeviceHash(
  req.ip,
  req.headers['user-agent'],
);



await this.prisma.refreshToken.create({
  data: {
    userId: user.id,
    hashedToken: hashedRefreshToken,
    jti: refreshJti,
    familyId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'], 
    deviceHash,
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

 async refreshToken(refreshToken: string, req: Request) {
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
      this.logger.warn(`User ${userId} revoked session ${jti}`);


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

    const currentDeviceHash = this.generateDeviceHash(
     req.ip,
     req.headers['user-agent'],
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
  return this.prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,  
      expiresAt: {
        gt: new Date(),
      },
    },
    select: { 
      jti: true,
      ipAddress: true,
      userAgent: true,
      createdAt: true,
    },
  });
}

  async revokeSession(userId: number, jti: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { jti },
    });

    if (!token) {
      throw new UnauthorizedException('Session not found');
    }

    // garante que o usuÁrio só pode revogar suas próprias sessões 
    if (token.userId !== userId){
      throw new UnauthorizedException('Acess denied');
    }
    await this.prisma.refreshToken.update({
      where: { jti },
      data: {revokedAt: new Date() },
    });
    
    return { message: 'Session revoked successfully'};
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

  this.logger.warn(`User ${userId} performed global logout`);

  return { message: 'Logged out successfully' };
 }

}
