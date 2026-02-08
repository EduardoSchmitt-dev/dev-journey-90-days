import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Injectable()
export class FeaturesService {
  private features: {
    id: number;
    name: string;
    description?: string;
    createdAt: Date;
  }[] = [];

  create(createFeatureDto: CreateFeatureDto) {
    const feature = {
      id: Date.now(),
      name: createFeatureDto.name,
      description: createFeatureDto.description,
      createdAt: new Date(),
    };

    this.features.push(feature);

    return feature;
  }

  findAll() {
    return this.features;
  }
}
