import { Injectable } from '@nestjs/common';
import { FeatureEntity, FeaturesRepository } from '../../features.repository';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class PrismaFeaturesRepository extends FeaturesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }
async create(feature: FeatureEntity): Promise<FeatureEntity> {
  const created = await this.prisma.feature.create({
    data: {
      name: feature.name,
      description: feature.description ?? null,
    },
  });

  return {
    ...created,
    description: created.description ?? undefined,
  };
}

async findAll(): Promise<FeatureEntity[]> {
  const features = await this.prisma.feature.findMany();

  return features.map((feature) => ({
    ...feature,
    description: feature.description ?? undefined,
  }));
 }
}
