import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { FeaturesRepository } from './features.repository';
import { PrismaFeaturesRepository } from './repositories/prisma/features.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { FEATURES_REPOSITORY } from './repositories/features.repository.token';
import { InMemoryFeaturesRepository } from './repositories/in-memory/features.repository';

@Module({
  imports: [PrismaModule],
  controllers: [FeaturesController],
  providers: [
    FeaturesService,
    {
     provide: FEATURES_REPOSITORY,
     useClass: InMemoryFeaturesRepository,
    },
  ],
}) 
export class FeaturesModule {}
