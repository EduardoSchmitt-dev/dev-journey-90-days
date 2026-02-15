import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { PrismaFeaturesRepository } from './repositories/prisma/features.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FEATURES_REPOSITORY } from './repositories/features.repository.token';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturesController],
  providers: [
    FeaturesService,
    {
      provide: FEATURES_REPOSITORY,
      useClass: PrismaFeaturesRepository,
    },
  ],
})
export class FeaturesModule {}

