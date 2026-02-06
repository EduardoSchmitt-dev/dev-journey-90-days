export interface Feature {
  id: string;
  name: string;
  description?: string;
}

export interface FeaturesRepository {
  findAll(): Promise<Feature[]>;
}