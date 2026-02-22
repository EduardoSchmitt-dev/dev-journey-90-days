import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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