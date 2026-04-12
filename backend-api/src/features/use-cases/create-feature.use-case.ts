import { ConflictException, Inject } from '@nestjs/common';
import { IFeaturesRepository } from '../repositories/features.repository.interface';
import { CreateFeatureDto } from '../dto/create-feature.dto';

export class CreateFeatureUseCase {
  constructor(
    @Inject('IFeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async execute(userId: number, data: CreateFeatureDto) {
    const existingFeature = await this.featuresRepository.findByName(data.name);

    if (existingFeature) {
      throw new ConflictException('Feature name already exists');
    }

    const newFeature = {
      id: Date.now(),
      name: data.name,
      description: data.description ?? null,
      userId,
      createdAt: new Date(),
      deletedAt: null,
    };

    return this.featuresRepository.create(newFeature);
  }
}
