import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async changePlan(userId: number, planName: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { name: planName },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { planId: plan.id },
    });

    return {
      message: `Plan upgraded to ${plan.name}`,
    };
  }
}
