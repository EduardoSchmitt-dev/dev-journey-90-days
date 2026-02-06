import { Module } from '@nestjs/common';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';
import { InMemoryFeaturesRepository } from './repositories/in-memory/features.repository';

@Module({
  controllers: [FeaturesController],
  providers: [
    FeaturesService,
    {
      provide: 'FeaturesRepository',
      useClass: InMemoryFeaturesRepository,
    },
  ],
})
export class FeaturesModule {}
