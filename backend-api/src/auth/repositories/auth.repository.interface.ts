import { Prisma } from '@prisma/client';

export interface CreateUserRepositoryData {
  email: string;
  password: string;
}

export interface CreateRefreshTokenRepositoryData {
  userId: number;
  hashedToken: string;
  jti: string;
  familyId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  deviceHash?: string | null;
  parentJti?: string | null;
  replacedByJti?: string | null;
  revoked?: boolean;
  revokedAt?: Date | null;
}

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<any>;
  updateUser(
    id: number,
    data: Prisma.UserUpdateInput | Prisma.UserUncheckedUpdateInput,
  ): Promise<any>;
  createUser(data: CreateUserRepositoryData): Promise<any>;
  findPlanByName(name: string): Promise<any>;

  createRefreshToken(data: CreateRefreshTokenRepositoryData): Promise<any>;
  findRefreshTokenByJti(jti: string): Promise<any>;
  revokeFamilyTokens(familyId: string): Promise<any>;
  revokeToken(jti: string, replacedByJti: string): Promise<any>;
  findActiveSessions(userId: number): Promise<any>;
  revokeSession(jti: string): Promise<any>;
  logoutAll(userId: number): Promise<any>;
}
