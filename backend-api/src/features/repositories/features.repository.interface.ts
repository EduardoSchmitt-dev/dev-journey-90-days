import { Feature } from '@prisma/client';

export interface IFeaturesRepository {
  create(data: any): Promise<any>;
  findAll(): Promise<Feature[]>;
  findById(id: number): Promise<any>;
  update(id: number, data: any): Promise<any>;
  softDelete(id: number): Promise<any>;
}
