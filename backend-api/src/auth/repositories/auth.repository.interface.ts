import { Prisma, User, Plan, RefreshToken } from '@prisma/client';

type CreateRefreshTokenInput = Omit<
  Prisma.RefreshTokenUncheckedCreateInput,
  'revoked'
>;

export interface IAuthRepository {
  // USER
  findUserByEmail(email: string): Promise<User | null>;
  updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>;
  createUser(data: { email: string; password: string }): Promise<User>;
  findPlanByName(name: string): Promise<Plan | null>;

  // REFRESH TOKEN
  createRefreshToken(data: CreateRefreshTokenInput): Promise<RefreshToken>;

  findRefreshTokenByJti(jti: string): Promise<RefreshToken | null>;

  revokeFamilyTokens(familyId: string): Promise<Prisma.BatchPayload>;

  revokeToken(jti: string, replacedByJti: string): Promise<RefreshToken>;

  createRotatedToken(data: CreateRefreshTokenInput): Promise<RefreshToken>;

  findActiveSessions(userId: number): Promise<
    Array<{
      jti: string;
      ipAddress: string | null;
      userAgent: string | null;
      createdAt: Date;
    }>
  >;

  revokeSession(jti: string): Promise<RefreshToken>;
  logoutAll(userId: number): Promise<Prisma.BatchPayload>;
}
