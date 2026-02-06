import { Controller, Get } from '@nestjs/common';
import { FeaturesService } from './features.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly service: FeaturesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }
}
