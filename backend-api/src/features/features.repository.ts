export type FeatureEntity = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
};

export abstract class FeaturesRepository {
  abstract create(feature: FeatureEntity): FeatureEntity;
  abstract findAll(): FeatureEntity[];
}
