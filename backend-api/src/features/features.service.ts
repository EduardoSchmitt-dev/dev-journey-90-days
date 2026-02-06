import { Inject, Injectable } from '@nestjs/common';
import { FeaturesRepository } from './repositories/features.repository';

@Injectable()
export class FeaturesService {
  constructor(
    @Inject('FeaturesRepository')
    private readonly repository: FeaturesRepository,
  ) {}

  findAll() {
    return this.repository.findAll();
  }
}
