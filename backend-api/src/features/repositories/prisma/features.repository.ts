import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IFeaturesRepository } from '../features.repository.interface';
import { FeatureEntity } from '../../features.repository';
import { CreateFeatureDto } from '../../dto/create-feature.dto'

@Injectable()
export class PrismaFeaturesRepository implements IFeaturesRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: { name: string; description?: string; userId: number }) {
  return this.prisma.feature.create({
    data: {
      name: data.name,
      description: data.description,
      user: {
        connect: { id: data.userId },
      },
    },
  });
}
async findAllByUser(userId: number): Promise<FeatureEntity[]> {
  return this.prisma.feature.findMany({
    where: {
      userId,
      deletedAt: null,
    },
  });
}

 async findAllByUserPaginated(
  userId: number,
  page: number,
  limit: number,
  search?: string,
  orderBy?: string,
  order: 'asc' | 'desc' = 'desc',
) {
  const skip = (page - 1) * limit;

  // 🔐 whitelist para evitar order injection
  const allowedOrderFields = ['name', 'createdAt'];

  const safeOrderBy: 'name' | 'createdAt' =
  allowedOrderFields.includes(orderBy ?? '')
    ? (orderBy as 'name' | 'createdAt')
    : 'createdAt';

  const where: any = {
    userId,
    deletedAt: null,
  };

  if (search) {
    where.name = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [data, total] = await Promise.all([
    this.prisma.feature.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [safeOrderBy]: order,
      },
    }),
    this.prisma.feature.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      lastPage: Math.ceil(total / limit),
      limit,
      orderBy: safeOrderBy,
      order,
    },
  };
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
