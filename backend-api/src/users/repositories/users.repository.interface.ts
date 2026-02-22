export interface IUsersRepository {
  findPlanByName(name: string): Promise<any>;
  updateUserPlan(userId: number, planId: number): Promise<any>;
}