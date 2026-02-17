import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { version } from 'os';
import { Throttle } from '@nestjs/throttler';

@Controller({ 
  path: 'auth', 
  version: '1',
})
  @ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('register')
   async register(@Body() data: RegisterDto) {
     return this.authService.register(data);
   }

   @Post('login')
   @Throttle({ default: { limit: 5, ttl: 60000 } })
   login(@Body() dto: LoginDto) {
     return this.authService.login(dto);
  }

  @Post('refresh')
  async refresh(@Body() body: { userId: number; refreshToken: string }) {
    return this.authService.refreshToken(body.userId, body.refreshToken);
  }
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthUser) {
    return this.authService.logout(user.userId);
  }
}
 