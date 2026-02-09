import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { FeaturesRepository, FeatureEntity } from './features.repository';

@Injectable()
export class FeaturesService {
  constructor(
    private readonly featuresRepository: FeaturesRepository,
  ) {}

  async create(createFeatureDto: CreateFeatureDto): Promise<FeatureEntity> {
    const feature: FeatureEntity = {
      id: Date.now(),
      name: createFeatureDto.name,
      description: createFeatureDto.description,
      createdAt: new Date(),
    };

    return await this.featuresRepository.create(feature);
  }

  async findAll(): Promise<FeatureEntity[]> {
    return await this.featuresRepository.findAll();
  }
}
