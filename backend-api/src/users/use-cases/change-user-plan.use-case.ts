import { Inject, NotFoundException } from '@nestjs/common';
import { IUsersRepository } from '../repositories/users.repository.interface';

export class ChangeUserPlanUseCase { 
    constructor(
      @Inject('IUsersRepository')
      private readonly usersRepository: IUsersRepository,
    ){}


    async execute(userID: number, planName: string) { 
      const plan = await this.usersRepository.findPlanByName(planName);

      if (!plan) {
        throw new NotFoundException('Plan not found');
    }
    
    await this.usersRepository.updateUserPlan(userID, plan.id);

    return { 
        message: `Plan upgraded to ${plan.name}`,
    };
  }
}