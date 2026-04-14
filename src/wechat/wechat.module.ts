import { Module } from '@nestjs/common';
import { WeChatService } from './wechat.service';

@Module({
  providers: [WeChatService],
  exports: [WeChatService],
})
export class WeChatModule {}