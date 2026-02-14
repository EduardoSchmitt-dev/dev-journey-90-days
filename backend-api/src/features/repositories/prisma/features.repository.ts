import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { IFeaturesRepository } from '../features.repository.interface';
import { FeatureEntity } from '../../features.repository';
import { CreateFeatureDto } from '../../dto/create-feature.dto';
 


@Injectable()
export class PrismaFeaturesRepository implements IFeaturesRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: FeatureEntity): Promise<FeatureEntity> {
  const created = await this.prisma.feature.create({
    data: {
      name: data.name,
      description: data.description,
      userId: data.userId,
    },
  });

  return created;
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
   async countByUser(userId: number): Promise<number> {
  return this.prisma.feature.count({
    where: {
      userId,
      deletedAt: null,
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
