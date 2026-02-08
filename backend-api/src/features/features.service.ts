import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { FeaturesRepository, FeatureEntity } from './features.repository';

@Injectable()
export class FeaturesService {
  constructor(
    private readonly featuresRepository: FeaturesRepository,
  ) {}

  create(createFeatureDto: CreateFeatureDto): FeatureEntity {
    const feature: FeatureEntity = {
      id: Date.now(),
      name: createFeatureDto.name,
      description: createFeatureDto.description,
      createdAt: new Date(),
    };

    return this.featuresRepository.create(feature);
  }

  findAll(): FeatureEntity[] {
    return this.featuresRepository.findAll();
  }
}
