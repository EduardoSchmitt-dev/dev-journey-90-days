import { ConflictException, NotFoundException } from '@nestjs/common';
import { UpdateFeatureUseCase } from '../update-feature.use-case';

describe('UpdateFeatureUseCase', () => {
  let repositoryMock: {
    findById: jest.Mock;
    findByName: jest.Mock;
    update: jest.Mock;
  };

  let useCase: UpdateFeatureUseCase;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      findByName: jest.fn(),
      update: jest.fn(),
    };

    useCase = new UpdateFeatureUseCase(repositoryMock as any);
  });

  it('should update a feature successfully', async () => {
    const featureId = 1;

    const existingFeature = {
      id: featureId,
      name: 'Feature Alpha',
      description: 'Old description',
    };

    const dto = {
      name: 'Feature Beta',
      description: 'New description',
    };

    const updatedFeature = {
      ...existingFeature,
      ...dto,
    };

    repositoryMock.findById.mockResolvedValue(existingFeature);
    repositoryMock.findByName.mockResolvedValue(null);
    repositoryMock.update.mockResolvedValue(updatedFeature);

    const result = await useCase.execute(featureId, dto);

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.findByName).toHaveBeenCalledWith(dto.name);
    expect(repositoryMock.update).toHaveBeenCalledWith(featureId, {
      ...existingFeature,
      ...dto,
    });
    expect(result).toEqual(updatedFeature);
  });

  it('should throw NotFoundException when feature does not exist', async () => {
    const featureId = 999;
    const dto = {
      name: 'Feature Beta',
    };

    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(featureId, dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.findByName).not.toHaveBeenCalled();
    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException when another feature already uses the same name', async () => {
    const featureId = 1;

    const existingFeature = {
      id: featureId,
      name: 'Feature Alpha',
      description: 'Old description',
    };

    const dto = {
      name: 'Feature Beta',
    };

    repositoryMock.findById.mockResolvedValue(existingFeature);
    repositoryMock.findByName.mockResolvedValue({
      id: 2,
      name: 'Feature Beta',
      description: 'Another feature',
    });

    await expect(useCase.execute(featureId, dto)).rejects.toBeInstanceOf(
      ConflictException,
    );

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.findByName).toHaveBeenCalledWith(dto.name);
    expect(repositoryMock.update).not.toHaveBeenCalled();
  });

  it('should allow update when the name belongs to the same feature', async () => {
    const featureId = 1;

    const existingFeature = {
      id: featureId,
      name: 'Feature Alpha',
      description: 'Old description',
    };

    const dto = {
      name: 'Feature Alpha',
      description: 'Updated description',
    };

    const updatedFeature = {
      ...existingFeature,
      ...dto,
    };

    repositoryMock.findById.mockResolvedValue(existingFeature);
    repositoryMock.findByName.mockResolvedValue({
      id: featureId,
      name: 'Feature Alpha',
      description: 'Old description',
    });
    repositoryMock.update.mockResolvedValue(updatedFeature);

    const result = await useCase.execute(featureId, dto);

    expect(repositoryMock.update).toHaveBeenCalledWith(featureId, {
      ...existingFeature,
      ...dto,
    });
    expect(result).toEqual(updatedFeature);
  });

  it('should update without calling findByName when dto.name is not provided', async () => {
    const featureId = 1;

    const existingFeature = {
      id: featureId,
      name: 'Feature Alpha',
      description: 'Old description',
    };

    const dto = {
      description: 'Only description updated',
    };

    const updatedFeature = {
      ...existingFeature,
      ...dto,
    };

    repositoryMock.findById.mockResolvedValue(existingFeature);
    repositoryMock.update.mockResolvedValue(updatedFeature);

    const result = await useCase.execute(featureId, dto);

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.findByName).not.toHaveBeenCalled();
    expect(repositoryMock.update).toHaveBeenCalledWith(featureId, {
      ...existingFeature,
      ...dto,
    });
    expect(result).toEqual(updatedFeature);
  });
});
