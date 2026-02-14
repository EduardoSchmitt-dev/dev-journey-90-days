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

  async create(feature: FeatureEntity): Promise<FeatureEntity> {
    this.features.push(feature);
    return feature;
  }

  async findAll(): Promise<FeatureEntity[]> {
    return this.features.filter(
      feature => !feature.deletedAt,
    );
  }
  
  async findById(id: number): Promise<FeatureEntity | null> {
    return this.features.find(feature => feature.id === id) ?? null;
  }
  
  async countByUser(userId: number): Promise<number> {
  return this.features.filter(
    (feature) => feature.userId === userId && !feature.deletedAt
  ).length;
  }

  async softDelete(id: number): Promise<void> {
  const feature = await this.findById(id);

  if (!feature) {
    return;
  }

  feature.deletedAt = new Date();
 }

  async update(
    id: number,
    updatedFeature: FeatureEntity,
  ): Promise<FeatureEntity> {
    const index = this.features.findIndex(
      feature => feature.id === id,
    );
    
    this.features[index] = updatedFeature;
    return updatedFeature;
  }
  
}
