import { UpdateFeatureDto } from '../dto/update-feature.dto';
import { FeatureEntity } from '../features.repository';

export interface IFeaturesRepository {
  create(data: {
    name: string;
    description?: string;
    userId: number;
  }): Promise<FeatureEntity>;

  findById(id: number): Promise<FeatureEntity | null>;

  findByIdAndUserId(id: number, userId: number): Promise<FeatureEntity | null>;

  findAll(): Promise<FeatureEntity[]>;

  update(id: number, dto: UpdateFeatureDto): Promise<FeatureEntity>;

  countByUser(userId: number): Promise<number>;

  softDelete(id: number): Promise<void>;
}
