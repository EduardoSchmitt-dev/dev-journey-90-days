import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

   @Post('register')
   async register(@Body() data: RegisterDto) {
     return this.authService.register(data);
   }

   @Post('login')
   async login(@Body() data: LoginDto) {
     return this.authService.login(data);
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
 