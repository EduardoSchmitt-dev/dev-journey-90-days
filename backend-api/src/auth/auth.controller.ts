import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { version } from 'os';
import { Throttle } from '@nestjs/throttler';
import { refreshTokenDto } from './dto/refresh-token.dto';
import { decode } from 'punycode';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express'; 
import { Delete, Param } from '@nestjs/common';

@Controller({ 
  path: 'auth', 
  version: '1',
})
  @ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
              private readonly jwtService: JwtService,
             ) {}

   @Get('sessions')
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth()
   getSession(@CurrentUser() user: AuthUser) {
    return this.authService.getActiveSessions(user.userId);
   }   
   
   @Delete('sessios/:jti')
   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth()
   revokeSession(
     @Param('jti') jti: string,
     @CurrentUser() user: AuthUser,
   ) {
    return this.authService.revokeSession(user.userId, jti);
   }
  

   @Post('register')
     async register(@Body() data: RegisterDto) {
     return this.authService.register(data);
   }

   @Post('login')
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   login(
    @Req() req: Request, 
    @Body() dto: LoginDto
  ) {
   return this.authService.login(dto, req);
   }


  @Post('refresh')
refresh(@Body() body: refreshTokenDto) {
  const { refresh_token } = body;
  return this.authService.refreshToken(refresh_token);
}


  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthUser) {
    return this.authService.logout(user.userId);
  }
}
 