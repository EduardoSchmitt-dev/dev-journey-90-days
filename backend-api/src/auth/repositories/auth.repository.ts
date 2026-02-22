import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  // USER

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  updateUser(id: number, data: any) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  createUser(data: any) {
    return this.prisma.user.create({ data });
  }

  findPlanByName(name: string) {
    return this.prisma.plan.findUnique({
      where: { name },
    });
  }

  // REFRESH TOKEN

  createRefreshToken(data: any) {
    return this.prisma.refreshToken.create({
      data,
    });
  }

  findRefreshTokenByJti(jti: string) {
    return this.prisma.refreshToken.findUnique({
      where: { jti },
    });
  }

  revokeFamilyTokens(familyId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { familyId },
      data: { revokedAt: new Date() },
    });
  }

  revokeToken(jti: string, replacedByJti: string) {
    return this.prisma.refreshToken.update({
      where: { jti },
      data: {
        revokedAt: new Date(),
        replacedByJti,
      },
    });
  }

  createRotatedToken(data: any) {
    return this.prisma.refreshToken.create({ data });
  }

  findActiveSessions(userId: number) {
    return this.prisma.refreshToken.findMany({
      where: {
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: {
        jti: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
    });
  }

  revokeSession(jti: string) {
    return this.prisma.refreshToken.update({
      where: { jti },
      data: { revokedAt: new Date() },
    });
  }

  logoutAll(userId: number) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}