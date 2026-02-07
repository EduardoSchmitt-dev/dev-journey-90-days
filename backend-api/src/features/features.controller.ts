import { Controller,Post, Body } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto'; 
import { FeaturesService } from './features.service';

@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}
 
  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
    };
  }
