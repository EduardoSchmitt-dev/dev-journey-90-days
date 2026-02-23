import { Inject, Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { CreateFeatureUseCase } from './use-cases/create-feature.use-case';
import { UpdateFeatureUseCase } from './use-cases/update-feature.use-case';
import { RemoveFeatureUseCase } from './use-cases/remove-feature.use-case';
import { FindFeaturesDto } from './dto/find-features.dto';
import { IFeaturesRepository } from './repositories/features.repository.interface';

@Injectable()
 export class FeaturesService {
   constructor(
   private readonly createFeaturesUseCase: CreateFeatureUseCase,
   private readonly updateFeatureUseCase: UpdateFeatureUseCase,
   private readonly removeFeatureUseCase: RemoveFeatureUseCase,
   @Inject('IFeaturesRepository')
   private readonly featuresRepository: IFeaturesRepository,
 ) {}

  async create(userId: number, dto: CreateFeatureDto) {
   return this.createFeaturesUseCase.execute(userId, dto);
 }

  async update(id: number, dto: UpdateFeatureDto) {
   return this.updateFeatureUseCase.execute(id, dto);
 }

  async remove(id:number) { 
   return this.removeFeatureUseCase.execute(id);
 }

  async findAll(query: FindFeaturesDto) {
    return this.featuresRepository.findAll()
  }
}


