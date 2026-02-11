import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFeaturesRepository } from '../features.repository.interface';
import { FeatureEntity } from '../../features.repository';

@Injectable()
export class PrismaFeaturesRepository implements IFeaturesRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(feature: FeatureEntity): Promise<FeatureEntity> {
  return this.prisma.feature.create({
    data: {
      id: feature.id,
      name: feature.name,
      description: feature.description ?? null,
      createdAt: feature.createdAt,
    },
  });
}


  async findAll(): Promise<FeatureEntity[]> {
    return this.prisma.feature.findMany({
      where: {
        deletedAt: null,
      },
    });
  }

  async findById(id: number): Promise<FeatureEntity | null> {
    return this.prisma.feature.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  async update(
    id: number,
    feature: FeatureEntity,
  ): Promise<FeatureEntity> {
    return this.prisma.feature.update({
      where: { id },
      data: {
        name: feature.name,
        description: feature.description,
        deletedAt: feature.deletedAt ?? null,
      },
    });
  }

  async softDelete(id: number): Promise<void> {
    await this.prisma.feature.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
