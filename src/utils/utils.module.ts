import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { WeChatModule } from '../wechat/wechat.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [WeChatModule, PrismaModule],
  controllers: [UtilsController],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
