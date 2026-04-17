import { Test, TestingModule } from '@nestjs/testing';
import { CompareFaceController } from './compare-face.controller';

describe('CompareFaceController', () => {
  let controller: CompareFaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompareFaceController],
    }).compile();

    controller = module.get<CompareFaceController>(CompareFaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
