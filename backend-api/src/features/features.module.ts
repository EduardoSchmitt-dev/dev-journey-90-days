import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { FeaturesRepository } from './features.repository';
import { PrismaFeaturesRepository } from './repositories/prisma/features.repository';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
  imports: [PrismaModule],
  controllers: [FeaturesController],
  providers: [
    FeaturesService,
    {
     provide: FeaturesRepository,
     useClass: PrismaFeaturesRepository,
    },
  ],
}) 
export class FeaturesModule {}
