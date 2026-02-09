process.env.DATABASE_URL = 'file:./dev.db';

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Features E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /features then GET /features should return created feature', async () => {
    const createDto = {
      name: 'E2E Feature',
      description: 'Created via e2e test',
    };

    // 1️⃣ Create feature
    const postResponse = await request(app.getHttpServer())
      .post('/features')
      .send(createDto)
      .expect(201);

    expect(postResponse.body).toHaveProperty('id');
    expect(postResponse.body.name).toBe(createDto.name);

    // 2️⃣ Get all features
    const getResponse = await request(app.getHttpServer())
      .get('/features')
      .expect(200);

    expect(Array.isArray(getResponse.body)).toBe(true);

    // 3️⃣ Validate created feature is in the list
    const found = getResponse.body.find(
      (feature: any) => feature.name === createDto.name,
    );

    expect(found).toBeDefined();
    expect(found.description).toBe(createDto.description);
  });
});
