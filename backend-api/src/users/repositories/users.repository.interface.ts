import { Plan, User } from '@prisma/client';

export interface IUsersRepository {
  findPlanByName(name: string): Promise<Plan | null>;
  updateUserPlan(userId: number, planId: number): Promise<User>;
}
