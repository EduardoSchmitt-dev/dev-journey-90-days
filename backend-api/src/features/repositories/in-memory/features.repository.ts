import { FeatureEntity, FeaturesRepository } from '../../features.repository';

export class InMemoryFeaturesRepository extends FeaturesRepository {
  private features: FeatureEntity[] = [];

  create(feature: FeatureEntity): FeatureEntity {
    this.features.push(feature);
    return feature;
  }

  findAll(): FeatureEntity[] {
    return this.features;
  }
}
