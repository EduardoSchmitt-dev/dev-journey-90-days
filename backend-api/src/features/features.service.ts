import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { FeaturesRepository, FeatureEntity } from './features.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateFeatureDto } from './dto/update-feature.dto';

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
  
  async remove(id: number): Promise<void> {
  const feature = await this.featuresRepository.findById(id);

  if (!feature) {
    throw new NotFoundException('Feature not found');
  }

  await this.featuresRepository.softDelete(id);
}

async update(
  id: number,
  updateFeatureDto: UpdateFeatureDto,
): Promise<FeatureEntity> {
  const feature = await this.featuresRepository.findById(id);

  if (!feature) {
    throw new NotFoundException('Feature not found');
  }

  const updatedFeature = {
    ...feature,
    ...updateFeatureDto,
  };

  return this.featuresRepository.update(id, updatedFeature);
 }
}