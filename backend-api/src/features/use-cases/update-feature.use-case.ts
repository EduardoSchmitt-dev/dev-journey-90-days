import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { IFeaturesRepository } from '../repositories/features.repository.interface';
import { UpdateFeatureDto } from '../dto/update-feature.dto';

export class UpdateFeatureUseCase {
  constructor(
    @Inject('IFeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async execute(id: number, dto: UpdateFeatureDto) {
    const feature = await this.featuresRepository.findById(id);

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    if (dto.name) {
      const featureWithSameName = await this.featuresRepository.findByName(
        dto.name,
      );

      if (featureWithSameName && featureWithSameName.id !== id) {
        throw new ConflictException('Feature name already exists');
      }
    }

    return this.featuresRepository.update(id, {
      ...feature,
      ...dto,
    });
  }
}
