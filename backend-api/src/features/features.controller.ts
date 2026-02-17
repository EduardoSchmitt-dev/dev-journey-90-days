import { Controller, Post, Get, Body, Param,  Patch, Put, ParseIntPipe, Delete, Query, UseGuards } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeaturesService } from './features.service';
import { FindFeaturesDto } from './dto/find-features.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { PlanGuard } from '../common/guards/plan.guard';
import { PlanLimit } from '../common/decorators/plan-limit.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';


@ApiTags('Features')
@ApiBearerAuth()
@Controller({
  path: 'features',
  version: '1',
})
 export class FeaturesController {
  constructor(
    private readonly featuresService: FeaturesService,
  ) {}




@Post()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PlanGuard)
@PlanLimit(3)
create(
  @Body() createFeatureDto: CreateFeatureDto,
  @CurrentUser() user: AuthUser,
) {
  return this.featuresService.create(user.userId, createFeatureDto);
}

@Get()
findAll(@Query() query: FindFeaturesDto) {
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