import { Controller,Post, Body } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto'; 

@Controller('features')
export class FeaturesController {
  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return {
      message: 'Feature criada com sucesso',
      data: createFeatureDto
    };
  }
}
