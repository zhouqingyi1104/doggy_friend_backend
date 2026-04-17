import { Module } from '@nestjs/common';
import { CompareFaceController } from './compare-face.controller';
import { CompareFaceService } from './compare-face.service';

@Module({
  controllers: [CompareFaceController],
  providers: [CompareFaceService]
})
export class CompareFaceModule {}
