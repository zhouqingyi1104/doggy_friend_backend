import { Test, TestingModule } from '@nestjs/testing';
import { MatchLoveService } from './match-love.service';

describe('MatchLoveService', () => {
  let service: MatchLoveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchLoveService],
    }).compile();

    service = module.get<MatchLoveService>(MatchLoveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
