import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { FeaturesRepository, FeatureEntity } from './features.repository';
import { NotFoundException } from '@nestjs/common';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';

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


  async findAll(query: FindFeaturesDto) {
    const { page = 1, limit = 10, name } = query;

    let features = await this.featuresRepository.findAll();

    // Filtro por nome 
    if (name) {
      features = features.filter(feature =>
        feature.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    
    const total = features.length;

    // Paginação
    const start = (page - 1) * limit; 
    const end = start + limit; 

    const paginatedData = features.slice(start, end);
    
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