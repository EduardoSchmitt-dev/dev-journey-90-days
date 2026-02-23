import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './repositories/users.repository';
import { ChangeUserPlanUseCase } from './use-cases/change-user-plan.use-case';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService, ChangeUserPlanUseCase,
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}