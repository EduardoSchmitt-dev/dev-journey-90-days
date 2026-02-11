import { Controller, Post, Get, Body, Param,  Patch, Put, ParseIntPipe, Delete, Query } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeaturesService } from './features.service';
import { FindFeaturesDto } from './dto/find-features.dto';


 @Controller('features')
 export class FeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
  ) {}

  @Post()
  create(@Body() createFeatureDto: CreateFeatureDto) {
    return this.featuresService.create(createFeatureDto);
  }

 @Get()
 findAll(
  @Query() query: FindFeaturesDto,
 ) {
  return this.featuresService.findAll(query);
 }


  @Put(':id')
  updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ) {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Patch(':id')
  updatePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ) {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.featuresService.remove(id);
  }
}