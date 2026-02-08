export type Feature = {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
};

export class FeaturesRepository {
  private features: Feature[] = [];

  create(feature: Feature): Feature {
    this.features.push(feature);
    return feature;
  }

  findAll(): Feature[] {
    return this.features;
  }
}
