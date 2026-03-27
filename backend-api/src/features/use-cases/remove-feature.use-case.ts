import { Inject, NotFoundException } from '@nestjs/common';
import { IFeaturesRepository } from '../repositories/features.repository.interface';

export class RemoveFeatureUseCase {
  constructor(
    @Inject('IFeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async execute(id: number, userId: number): Promise<void> {
    const feature = await this.featuresRepository.findByIdAndUserId(id, userId);

    if (!feature) {
      throw new NotFoundException('Feature not found');
    }

    return this.featuresRepository.softDelete(id);
  }
}
