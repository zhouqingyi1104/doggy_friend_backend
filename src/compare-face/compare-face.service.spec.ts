import { Test, TestingModule } from '@nestjs/testing';
import { CompareFaceService } from './compare-face.service';

describe('CompareFaceService', () => {
  let service: CompareFaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompareFaceService],
    }).compile();

    service = module.get<CompareFaceService>(CompareFaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
