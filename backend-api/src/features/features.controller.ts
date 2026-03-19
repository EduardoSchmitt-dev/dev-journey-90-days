import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  Put,
  ParseIntPipe,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeaturesService } from './features.service';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../auth';
import { PlanGuard } from '../common/guards/plan.guard';
import { PlanLimit } from '../common/decorators/plan-limit.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiTags('Features')
@ApiBearerAuth()
@Controller({
  path: 'features',
  version: '1',
})
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @UseGuards(JwtAuthGuard, PlanGuard)
  @Post()
  @ApiBearerAuth()
  @PlanLimit(3)
  create(
    @Body() createFeatureDto: CreateFeatureDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.featuresService.create(user.userId, createFeatureDto);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: PaginationQueryDto) {
    return this.featuresService.findAll(
      user.userId,
      query.limit ?? 10,
      query.search,
      query.order ?? 'desc',
      query.cursor,
    );
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
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.featuresService.remove(id);
  }
}
