import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
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
    private readonly createFeatureUseCase: CreateFeatureUseCase,
    private readonly updateFeatureUseCase: UpdateFeatureUseCase,
    private readonly removeFeatureUseCase: RemoveFeatureUseCase,
    @Inject('IFeaturesRepository')
    private readonly featuresRepository: IFeaturesRepository,
  ) {}

  async create(userId: number, dto: CreateFeatureDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { plan: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const featuresCount = await this.prisma.feature.count({
      where: { userId },
    });

    if (featuresCount >= user.plan.maxFeatures) {
      throw new ForbiddenException('Feature limit reached for your plan');
    }

    return this.prisma.feature.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async update(id: number, userId: number, updateFeatureDto: UpdateFeatureDto) {
    return this.updateFeatureUseCase.execute(id, userId, updateFeatureDto);
  }

  async remove(id: number, userId: number) {
    return this.removeFeatureUseCase.execute(id, userId);
  }

  async findAll(
    userId: number,
    limit: number,
    search?: string,
    orderBy: 'name' | 'createdAt' = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
    cursor?: number,
  ) {
    const where: Prisma.FeatureWhereInput = {
      userId,
      deletedAt: null,
    };

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

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
        orderBy,
        order,
        search: search ?? null,
      },
    };
  }
}
