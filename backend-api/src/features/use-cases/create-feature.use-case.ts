import { Inject } from "@nestjs/common";
import { IFeaturesRepository } from "../repositories/features.repository.interface";
import { CreateFeatureDto } from "../dto/create-feature.dto";

export class CreateFeatureUseCase {
    constructor(
        @Inject('IFeaturesRepository')
        private readonly featuresRepository: IFeaturesRepository,
    ) {}

    async execute(userId: number, data: CreateFeatureDto) {
        const newFeature = {
  id: Date.now(),
  name: data.name,
  description: data.description ?? null,
  userId,  // 👈 CORRETO
  createdAt: new Date(),
  deletedAt: null,
};

        return this.featuresRepository.create(newFeature);
    }
 }