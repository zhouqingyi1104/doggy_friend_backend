import { Module } from '@nestjs/common';
import { SaleFriendController } from './sale-friend.controller';
import { SaleFriendService } from './sale-friend.service';

@Module({
  controllers: [SaleFriendController],
  providers: [SaleFriendService]
})
export class SaleFriendModule {}
