import { Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { IAuthRepository } from '../repositories/auth.repository.interface';

export class RefreshTokenUseCase { 
    constructor(
        @Inject('IAuthRepository')
        private readonly authRepository: IAuthRepository, 
        private readonly jwtService: JwtService,
    ) {}

    async execute(refreshToken: string, ip: string, userAgent: string) {
        let payload: any;

        try { 
            payload = this.jwtService.verify(refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid refresh token ')
        }
        const storedToken = await this.authRepository.findRefreshTokenByJti(payload.jti);
        
        if (!storedToken) {
          throw new UnauthorizedException('Refresh token reuse detected');
        }

        // Reuse Detection 
        if (storedToken.revokedAt) {
          await this.authRepository.revokeFamilyTokens(storedToken.familyId);
          throw new UnauthorizedException('Refresh token reuse detected');
        }

        const validHash = await bcrypt.compare(refreshToken, storedToken.hashedToken);
        
        if (!validHash) {
          throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token expired');
        }

        // ROTATION 
        const newJti = randomUUID();
 
        await this.authRepository.revokeToken(storedToken.jti, newJti);
        
        const newPayload = { 
           sub: payload.sub, 
           email: payload.email,
           jti: newJti,
        };

        const newAccessToken = this.jwtService.sign(newPayload, {expiresIn: '15m' });
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });
     
       await this.authRepository.createRefreshToken({
        userId: payload.sub, 
        hashedToken: await bcrypt.hash(newRefreshToken, 10),
        jti: newJti,
        familyId: storedToken.familyId,
        parentJti: storedToken.jti,
        ipAddress: ip,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
        
  return { 
    acess_token: newAccessToken,
    refresh_token: newRefreshToken,
   };
 } 
}