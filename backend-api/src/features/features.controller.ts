import { Body, Controller, Get, Post } from '@nestjs/common';
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';



@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Get()
  findAll() {
    return this.featuresService.findAll();
  }

  @Post()
  create(@Body() body: CreateFeatureDto) {
    return this.featuresService.create(body);
  }
}
