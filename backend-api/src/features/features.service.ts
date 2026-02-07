import { Injectable } from '@nestjs/common';
import { CreateFeatureDto } from './dto/create-feature.dto';

@Injectable()
export class FeaturesService {
  create(createFeatureDto: CreateFeatureDto) {
    return {
      message: 'Feature created successfully',
      data: createFeatureDto,
    };
  }
}
