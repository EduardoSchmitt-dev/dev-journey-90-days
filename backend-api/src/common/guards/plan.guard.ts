import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { PLAN_LIMIT_KEY } from '../decorators/plan-limit.decorator';

@Injectable()
export class PlanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
      console.log('PlanGuard executado');

    const limit = this.reflector.get<number>(
      PLAN_LIMIT_KEY,
      context.getHandler(),
    );

    if (!limit) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userWithPlan = await this.prisma.user.findUnique({
      where: { id: user.userId },
      include: { plan: true },
    });

    if (!userWithPlan) {
      throw new ForbiddenException('User not found');
    }

    if (userWithPlan.plan.name !== 'Free') {
      return true;
    }

    const count = await this.prisma.feature.count({
      where: {
        userId: user.userId,
        deletedAt: null,
      },
    });

    if (count >= limit) {
      throw new ForbiddenException(
        'Free plan limit reached. Upgrade your plan.',
      );
    }

    return true;
  }
}
