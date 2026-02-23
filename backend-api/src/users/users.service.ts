import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUsersRepository } from './repositories/users.repository.interface';
import { ChangeUserPlanUseCase } from './use-cases/change-user-plan.use-case';

@Injectable()
export class UsersService {
  constructor(
    private readonly changeUserPlanUseCase: ChangeUserPlanUseCase,
  ) {}

  async changePlan(userId: number, planName: string) {
    return this.changeUserPlanUseCase.execute(userId, planName);
  }
}