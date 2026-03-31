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
import { PlanThrottlerGuard } from '../common/guards/plan-throttler.guard';
@UseGuards(JwtAuthGuard, PlanThrottlerGuard)
@ApiTags('Features')
@ApiBearerAuth()
@Controller({
  path: 'features',
  version: '1',
})
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @UseGuards(PlanGuard) // metodo create tem um limite de 3 por plano, então aplicamos o PlanGuard para verificar o plano do usuário antes de aplicar o limitespo
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
      query.orderBy ?? 'createdAt',
      query.order ?? 'desc',
      query.cursor,
    );
  }

  @Put(':id')
  updatePut(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureDto: UpdateFeatureDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.featuresService.update(id, user.userId, updateFeatureDto);
  }

  @Patch(':id')
  updatePatch(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFeatureDto: UpdateFeatureDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.featuresService.update(id, user.userId, updateFeatureDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.featuresService.remove(id, user.userId);
  }
}
