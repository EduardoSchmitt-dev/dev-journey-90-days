import { Feature, FeaturesRepository } from '../features.repository';

export class InMemoryFeaturesRepository implements FeaturesRepository {
  private features: Feature[] = [
    {
      id: '1',
      name: 'Feature A',
      description: 'Exemplo em memória',
    },
  ];

  async findAll(): Promise<Feature[]> {
    return this.features;
  }
}
