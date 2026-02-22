export interface IAuthRepository {
  // USER
  findUserByEmail(email: string): Promise<any>;
  updateUser(id: number, data: any): Promise<any>;
  createUser(data: any): Promise<any>;
  findPlanByName(name: string): Promise<any>;

  // REFRESH TOKEN
  createRefreshToken(data: any): Promise<any>;
  findRefreshTokenByJti(jti: string): Promise<any>;
  revokeFamilyTokens(familyId: string): Promise<any>;
  revokeToken(jti: string, replacedByJti: string): Promise<any>;
  findActiveSessions(userId: number): Promise<any>;
  revokeSession(jti: string): Promise<any>;
  logoutAll(userId: number): Promise<any>;
}