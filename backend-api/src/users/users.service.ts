import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IUsersRepository } from './repositories/users.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  async changePlan(userId: number, planName: string) {
    const plan = await this.usersRepository.findPlanByName(planName);

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    await this.usersRepository.updateUserPlan(userId, plan.id);

    return {
      message: `Plan upgraded to ${plan.name}`,
    };
  }
}