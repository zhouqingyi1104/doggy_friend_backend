import { Test, TestingModule } from '@nestjs/testing';
import { MatchLoveController } from './match-love.controller';

describe('MatchLoveController', () => {
  let controller: MatchLoveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchLoveController],
    }).compile();

    controller = module.get<MatchLoveController>(MatchLoveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
