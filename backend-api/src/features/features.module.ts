import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { PrismaFeaturesRepository } from './repositories/prisma/features.repository';
import { PrismaModule } from '../infrastructure/prisma/prisma.module';
import { CreateFeatureUseCase } from './use-cases/create-feature.use-case';
import { UpdateFeatureUseCase } from './use-cases/update-feature.use-case';
import { RemoveFeatureUseCase } from './use-cases/remove-feature.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturesController],
  providers: [
    FeaturesService, CreateFeatureUseCase, UpdateFeatureUseCase, RemoveFeatureUseCase,
    {
      provide: 'IFeaturesRepository',
      useClass: PrismaFeaturesRepository,
    },
  ],
})
export class FeaturesModule {}

