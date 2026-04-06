import { Inject, Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateFeatureUseCase } from './use-cases/create-feature.use-case';
import { UpdateFeatureUseCase } from './use-cases/update-feature.use-case';
import { RemoveFeatureUseCase } from './use-cases/remove-feature.use-case';
import { IFeaturesRepository } from './repositories/features.repository.interface';
import { PrismaService } from '../infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
@Injectable()
export class FeaturesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly createFeaturesUseCase: CreateFeatureUseCase,
    private readonly updateFeatureUseCase: UpdateFeatureUseCase,
    private readonly removeFeatureUseCase: RemoveFeatureUseCase,
    @Inject('IFeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async create(userId: number, dto: CreateFeatureDto) {
    return this.createFeaturesUseCase.execute(userId, dto);
  }

  async update(id: number, dto: UpdateFeatureDto) {
    return this.updateFeatureUseCase.execute(id, dto);
  }

  async remove(id: number) {
    return this.removeFeatureUseCase.execute(id);
  }

  async findAll(
    userId: number,
    limit: number,
    search?: string,
    order: 'asc' | 'desc' = 'desc',
    cursor?: number,
    orderBy: 'createdAt' | 'name' = 'createdAt',
  ) {
    const where: Prisma.FeatureWhereInput = {
      userId,
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
    };

    const queryOptions: Prisma.FeatureFindManyArgs = {
      where,
      take: limit,
      orderBy: {
        [orderBy]: order,
      },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const features = await this.prisma.feature.findMany(queryOptions);

    const nextCursor =
      features.length === limit ? features[features.length - 1].id : null;

    return {
      data: features,
      meta: {
        nextCursor,
        limit,
      },
    };
  }
}
