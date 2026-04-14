import { FeatureEntity, FeaturesRepository } from '../../features.repository';

export class InMemoryFeaturesRepository extends FeaturesRepository {
  protected features: FeatureEntity[] = [];

  create(feature: FeatureEntity): Promise<FeatureEntity> {
    this.features.push(feature);
    return Promise.resolve(feature);
  }

  findAll(): Promise<FeatureEntity[]> {
    return Promise.resolve(this.features);
  }
}
