import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [PrismaModule, UtilsModule],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
