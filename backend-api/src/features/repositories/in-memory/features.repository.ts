import { FeatureEntity, FeaturesRepository } from '../../features.repository';

export class InMemoryFeaturesRepository extends FeaturesRepository {
  protected features: FeatureEntity[] = [];

  async create(feature: FeatureEntity): Promise<FeatureEntity> {
    this.features.push(feature);
    return feature;
  }

  async findAll(): Promise<FeatureEntity[]> {
    return this.features;
  }
}
