import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import {
  CreateRefreshTokenRepositoryData,
  CreateUserRepositoryData,
  IAuthRepository,
} from './auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        plan: true,
      },
    });
  }

  updateUser(
    id: number,
    data: Prisma.UserUpdateInput | Prisma.UserUncheckedUpdateInput,
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async createUser(data: CreateUserRepositoryData) {
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
        role: 'FREE', // Se o Prisma reclamar aqui por causa do enum, trocar para: import { Role } from '@prisma/client'; + role: Role.FREE,
        plan: {
          connect: { id: freePlan.id },
        },
      },
    });
  }

  findPlanByName(name: string) {
    return this.prisma.plan.findUnique({
      where: { name },
    });
  }

  createRefreshToken(data: CreateRefreshTokenRepositoryData) {
    return this.prisma.refreshToken.create({
      data: {
        ...data,
        revoked: data.revoked ?? false,
        revokedAt: data.revokedAt ?? null,
        replacedByJti: data.replacedByJti ?? null,
        parentJti: data.parentJti ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        deviceHash: data.deviceHash ?? null,
      },
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

  createRotatedToken(data: CreateRefreshTokenRepositoryData) {
    return this.prisma.refreshToken.create({
      data: {
        ...data,
        revoked: data.revoked ?? false,
        revokedAt: data.revokedAt ?? null,
        replacedByJti: data.replacedByJti ?? null,
        parentJti: data.parentJti ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        deviceHash: data.deviceHash ?? null,
      },
    });
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
