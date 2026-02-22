import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPlanByName(name: string) {
    return this.prisma.plan.findUnique({
      where: { name },
    });
  }

  updateUserPlan(userId: number, planId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { planId },
    });
  }
}