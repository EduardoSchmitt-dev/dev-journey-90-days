import { FeatureEntity } from "../features.repository";
import { CreateFeatureDto } from '../dto/create-feature.dto';


export interface IFeaturesRepository {
  create(data: FeatureEntity): Promise<FeatureEntity>;
  findAll(): Promise<FeatureEntity[]>;
  findById(id: number): Promise<FeatureEntity | null>;
  update(id: number, feature: FeatureEntity): Promise<FeatureEntity>;
  softDelete(id: number): Promise<void>;
  countByUser(userId: number): Promise<number>;
}

