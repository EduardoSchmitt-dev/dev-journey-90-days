import { Module } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { FeaturesRepository } from './features.repository';

@Module({
  controllers: [FeaturesController],
  providers: [FeaturesService, FeaturesRepository],
})
export class FeaturesModule {}
