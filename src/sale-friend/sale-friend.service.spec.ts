import { Test, TestingModule } from '@nestjs/testing';
import { SaleFriendService } from './sale-friend.service';

describe('SaleFriendService', () => {
  let service: SaleFriendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaleFriendService],
    }).compile();

    service = module.get<SaleFriendService>(SaleFriendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
