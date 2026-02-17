import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';


@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@ApiBody({
  schema: {
    example: {
      planName: 'Pro',
    },
  },
})
@ApiResponse({
  status: 200,
  description: 'Plan upgraded successfuly',
})
  @Patch('me/plan')
  @UseGuards(JwtAuthGuard)
  upgradePlan(
    @CurrentUser() user: AuthUser,
    @Body() body: { planName: 'Free' | 'Pro' | 'Enterprise' },
  ) {
    return this.usersService.changePlan(user.userId, body.planName);
  }
}
