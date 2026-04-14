import { Injectable } from '@nestjs/common';
import { Prisma, User, Plan, RefreshToken } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IAuthRepository } from './auth.repository.interface';

type CreateRefreshTokenInput = Omit<
  Prisma.RefreshTokenUncheckedCreateInput,
  'revoked'
>;

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createUser(data: { email: string; password: string }): Promise<User> {
    const freePlan = await this.prisma.plan.findUnique({
      where: { name: 'FREE' },
    });

    if (!freePlan) {
      throw new Error('Default FREE plan not found');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: 'FREE',
        plan: {
          connect: { id: freePlan.id },
        },
      },
    });
  }

  findPlanByName(name: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({
      where: { name },
    });
  }

  createRefreshToken(data: CreateRefreshTokenInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        ...data,
        revoked: false,
      },
    });
  }

  findRefreshTokenByJti(jti: string): Promise<RefreshToken | null> {
    return this.prisma.refreshToken.findUnique({
      where: { jti },
    });
  }

  revokeFamilyTokens(familyId: string): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.updateMany({
      where: { familyId },
      data: { revokedAt: new Date() },
    });
  }

  revokeToken(jti: string, replacedByJti: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { jti },
      data: {
        revokedAt: new Date(),
        replacedByJti,
      },
    });
  }

  createRotatedToken(data: CreateRefreshTokenInput): Promise<RefreshToken> {
    return this.prisma.refreshToken.create({
      data: {
        ...data,
        revoked: false,
      },
    });
  }

  findActiveSessions(userId: number): Promise<
    Array<{
      jti: string;
      ipAddress: string | null;
      userAgent: string | null;
      createdAt: Date;
    }>
  > {
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

  revokeSession(jti: string): Promise<RefreshToken> {
    return this.prisma.refreshToken.update({
      where: { jti },
      data: { revokedAt: new Date() },
    });
  }

  logoutAll(userId: number): Promise<Prisma.BatchPayload> {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
