import { NotFoundException } from '@nestjs/common';
import { RemoveFeatureUseCase } from '../remove-feature.use-case';

describe('RemoveFeatureUseCase', () => {
  let repositoryMock: {
    findById: jest.Mock;
    softDelete: jest.Mock;
  };

  let useCase: RemoveFeatureUseCase;

  beforeEach(() => {
    repositoryMock = {
      findById: jest.fn(),
      softDelete: jest.fn(),
    };

    useCase = new RemoveFeatureUseCase(repositoryMock as any);
  });

  it('should soft delete a feature successfully', async () => {
    const featureId = 1;

    repositoryMock.findById.mockResolvedValue({
      id: featureId,
      name: 'Feature Alpha',
      description: 'Feature description',
    });

    repositoryMock.softDelete.mockResolvedValue(undefined);

    await useCase.execute(featureId);

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.softDelete).toHaveBeenCalledWith(featureId);
  });

  it('should throw NotFoundException when feature does not exist', async () => {
    const featureId = 999;

    repositoryMock.findById.mockResolvedValue(null);

    await expect(useCase.execute(featureId)).rejects.toBeInstanceOf(
      NotFoundException,
    );

    expect(repositoryMock.findById).toHaveBeenCalledWith(featureId);
    expect(repositoryMock.softDelete).not.toHaveBeenCalled();
  });
});
