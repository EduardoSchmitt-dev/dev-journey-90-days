import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';
import { IFeaturesRepository } from './repositories/features.repository.interface';
import { FEATURES_REPOSITORY } from './repositories/features.repository.token';
import { FeatureEntity } from './features.repository';



@Injectable()
export class FeaturesService {
  constructor(
  @Inject(FEATURES_REPOSITORY)
  private readonly featuresRepository: IFeaturesRepository,
) {}
  
  async create(userId: number, data: CreateFeatureDto) {
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

  async findAll(query: FindFeaturesDto) {
  const { page = 1, limit = 10, name } = query;

  const features = await this.featuresRepository.findAll();

  let filtered = features;

  if (name) {
    filtered = features.filter(feature =>
      feature.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  const total = filtered.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedData = filtered.slice(start, end);

  return {
    data: paginatedData,
    meta: {
      page,
      limit,
      total,
    },
  };
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
) {
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
