import { Injectable } from '@nestjs/common';
import { FeaturesRepository } from './features.repository';

@Injectable()
export class FeaturesService {
  constructor(private readonly repo: FeaturesRepository) {}

  findAll() {
    return this.repo.findAll();
  }
}
