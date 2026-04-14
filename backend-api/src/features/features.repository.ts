export interface FeatureEntity {
  id: number;
  name: string;
  description: string | null;
  userId: number;
  createdAt: Date;
  deletedAt: Date | null;
}

export class FeaturesRepository {
  protected features: FeatureEntity[] = [];

  create(feature: FeatureEntity): Promise<FeatureEntity> {
    this.features.push(feature);
    return Promise.resolve(feature);
  }

  findAll(): Promise<FeatureEntity[]> {
    return Promise.resolve(
      this.features.filter((feature) => !feature.deletedAt),
    );
  }

  findById(id: number): Promise<FeatureEntity | null> {
    return Promise.resolve(
      this.features.find((feature) => feature.id === id) ?? null,
    );
  }

  countByUser(userId: number): Promise<number> {
    return Promise.resolve(
      this.features.filter(
        (feature) => feature.userId === userId && !feature.deletedAt,
      ).length,
    );
  }

  async softDelete(id: number): Promise<void> {
    const feature = await this.findById(id);

    if (!feature) {
      return;
    }

    feature.deletedAt = new Date();
  }

  update(id: number, updatedFeature: FeatureEntity): Promise<FeatureEntity> {
    const index = this.features.findIndex((feature) => feature.id === id);

    this.features[index] = updatedFeature;
    return Promise.resolve(updatedFeature);
  }
}
