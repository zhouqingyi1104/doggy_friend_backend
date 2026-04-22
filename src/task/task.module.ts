import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UtilsModule } from '../utils/utils.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, UtilsModule, WalletModule],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
