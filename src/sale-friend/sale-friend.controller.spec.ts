import { Test, TestingModule } from '@nestjs/testing';
import { SaleFriendController } from './sale-friend.controller';

describe('SaleFriendController', () => {
  let controller: SaleFriendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaleFriendController],
    }).compile();

    controller = module.get<SaleFriendController>(SaleFriendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
