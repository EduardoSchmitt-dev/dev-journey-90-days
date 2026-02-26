import { Controller, Patch, Body, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator'; 
import { AuthUser } from '../auth';
import { ApiTags, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { version } from 'os';
import { RolesGuard } from '../common/guards/roles.guards';


@Controller({
  path: 'users',
  version: '1',
})

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
