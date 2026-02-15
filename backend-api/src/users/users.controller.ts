import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me/plan')
  @UseGuards(JwtAuthGuard)
  upgradePlan(
    @CurrentUser() user: AuthUser,
    @Body() body: { planName: 'Free' | 'Pro' | 'Enterprise' },
  ) {
    return this.usersService.changePlan(user.userId, body.planName);
  }
}
