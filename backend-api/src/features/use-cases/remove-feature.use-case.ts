import { Inject, NotFoundException } from "@nestjs/common";
import { IFeaturesRepository } from "../repositories/features.repository.interface";

export class RemoveFeatureUseCase { 
    constructor(
        @Inject('IFeaturesRepository')
        private readonly featuresRepository: IFeaturesRepository,
    ) {}

    async execute(id:number) {
      const feature = await this.featuresRepository.findById(id);

      if (!feature) {
        throw new NotFoundException('Feature not found');
      }
      
        await this.featuresRepository.softDelete(id);
     }
}
