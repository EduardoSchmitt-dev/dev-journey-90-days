import { Feature } from '@prisma/client';

export interface IFeaturesRepository {
  create(data: any): Promise<Feature>;
  findAll(): Promise<Feature[]>;
  findById(id: number): Promise<Feature | null>;
  update(id: number, data: any): Promise<Feature>;
  softDelete(id: number): Promise<any>;

  findAllByUser(userId: number): Promise<Feature[]>;
  findAllByUserPaginated(
  userId: number,
  page: number,
  limit: number,
  search?: string,
 ): Promise<any>;
}