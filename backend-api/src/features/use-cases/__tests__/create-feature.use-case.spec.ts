import { ConflictException } from '@nestjs/common';
import { CreateFeatureUseCase } from '../create-feature.use-case';

describe('CreateFeatureUseCase', () => {
  let repositoryMock: {
    create: jest.Mock;
    findByName: jest.Mock;
  };

  let useCase: CreateFeatureUseCase;

  beforeEach(() => {
    repositoryMock = {
      create: jest.fn(),
      findByName: jest.fn(),
    };

    useCase = new CreateFeatureUseCase(repositoryMock as any);
  });

  it('should create a feature successfully', async () => {
    const userId = 1;

    const dto = {
      name: 'Feature Alpha',
      description: 'Feature description',
    };

    const createdFeature = {
      id: 1,
      name: dto.name,
      description: dto.description,
    };

    repositoryMock.findByName.mockResolvedValue(null);
    repositoryMock.create.mockResolvedValue(createdFeature);

    const result = await useCase.execute(userId, dto);

    expect(repositoryMock.findByName).toHaveBeenCalledWith(dto.name);
    expect(repositoryMock.create).toHaveBeenCalled();
    expect(result).toEqual(createdFeature);
  });

  it('should throw ConflictException when feature name already exists', async () => {
    const userId = 1;

    const dto = {
      name: 'Feature Alpha',
      description: 'Duplicated feature',
    };

    repositoryMock.findByName.mockResolvedValue({
      id: 2,
      name: dto.name,
      description: 'Existing feature',
    });

    await expect(useCase.execute(userId, dto)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(repositoryMock.findByName).toHaveBeenCalledWith(dto.name);
    expect(repositoryMock.create).not.toHaveBeenCalled();
  });
});
