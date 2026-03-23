export interface JwtPayload {
  sub: number; // userId
  email: string;
  role: string;
  plan?: string;
  jti?: string; // JWT ID for token revocation
}
