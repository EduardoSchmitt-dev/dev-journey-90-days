process.env.DATABASE_URL = 'file:./dev.db';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

interface FeatureResponse {
  id: number;
  name: string;
  description?: string;
}

describe('Features E2E', () => {
  let app: INestApplication;
  let server: Parameters<typeof request>[0];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    server = app.getHttpServer() as Parameters<typeof request>[0];
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /features then GET /features should return created feature', async () => {
    const createDto = {
      name: 'E2E Feature',
      description: 'Created via e2e test',
    };

    const postResponse = await request(server)
      .post('/features')
      .send(createDto)
      .expect(201);

    const createdFeature = postResponse.body as FeatureResponse;

    expect(createdFeature).toHaveProperty('id');
    expect(createdFeature.name).toBe(createDto.name);

    const getResponse = await request(server).get('/features').expect(200);

    const features = getResponse.body as FeatureResponse[];

    expect(Array.isArray(features)).toBe(true);

    const found = features.find((feature) => feature.name === createDto.name);

    expect(found).toBeDefined();
    expect(found?.description).toBe(createDto.description);
  });
});
