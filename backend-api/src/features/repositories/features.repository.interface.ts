import { FeatureEntity } from "../features.repository";


export interface IFeaturesRepository { 
  create(feature: FeatureEntity): Promise<FeatureEntity>;
  findAll(): Promise<FeatureEntity[]>;
  findById(id: number): Promise<FeatureEntity | null>;
  update(id: number, feature: FeatureEntity): Promise<FeatureEntity>;
  softDelete(id: number): Promise<void>;
}