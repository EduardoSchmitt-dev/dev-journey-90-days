import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class UsersRepository {
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