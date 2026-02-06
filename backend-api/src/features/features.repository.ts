export interface Feature {
  id: number;
  title: string;
}

export class FeaturesRepository {
  private features: Feature[] = [
    { id: 1, title: 'Feature A' },
    { id: 2, title: 'Feature B' },
  ];

  findAll() {
    return this.features;
  }
}
