import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Injectable()
export class FeaturesService {
  private features: CreateFeatureDto[] = [];

  findAll() {
    return this.features;
  }

  create(data: CreateFeatureDto) {
    this.features.push(data);
    return data;
  }
}
