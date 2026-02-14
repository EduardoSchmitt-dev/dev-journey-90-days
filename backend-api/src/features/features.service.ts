import { Injectable, Inject, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FindFeaturesDto } from './dto/find-features.dto';
import { IFeaturesRepository } from './repositories/features.repository.interface';
import { FEATURES_REPOSITORY } from './repositories/features.repository.token';
import { FeatureEntity } from './features.repository';
import { PrismaService } from '../prisma/prisma.service';



@Injectable()
export class FeaturesService {
  constructor(
  @Inject(FEATURES_REPOSITORY)
  private readonly featuresRepository: IFeaturesRepository,
  private readonly prisma: PrismaService,
) {}
  
  async create(userId: number, data: CreateFeatureDto) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  if (user.plan.name === 'Free') {
    const count = await this.featuresRepository.countByUser(userId);

    if (count >= 3) {
      throw new ForbiddenException(
        'Free plan limit reached. Upgrade your plan.',
      );
    }
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
