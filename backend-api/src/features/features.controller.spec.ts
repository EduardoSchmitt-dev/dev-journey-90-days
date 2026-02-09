import { Test, TestingModule } from '@nestjs/testing';
import { FeaturesController } from './features.controller';
import { FeaturesService } from './features.service';

describe('FeaturesController', () => {
  let controller: FeaturesController;
  let service: FeaturesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeaturesController],
      providers: [
        {
          provide: FeaturesService,
          useValue: {
            findAll: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FeaturesController>(FeaturesController);
    service = module.get<FeaturesService>(FeaturesService);
  });


it('should return all features', async () => {
  const result = [
    {
      id: 1,
      name: 'Feature A',
      description: 'Test feature',
      createdAt: new Date(),
    },
  ];

  jest.spyOn(service, 'findAll').mockResolvedValue(result);

  const response = await controller.findAll();

  expect(service.findAll).toHaveBeenCalled();
  expect(response).toEqual(result);
});

it('should create a feature', async () => {
  const dto = {
    name: 'New Feature',
    description: 'Feature description',
   };

    const createdFeature = {
      id: 1,
      name: 'New Feature',
      description: 'Feature description',
      createdAt: new Date(),
    };

    jest.spyOn(service, 'create').mockResolvedValue(createdFeature);

    const response = await controller.create(dto as any);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(response).toEqual(createdFeature);
  });
});
