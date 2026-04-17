import { Module } from '@nestjs/common';
import { MatchLoveController } from './match-love.controller';
import { MatchLoveService } from './match-love.service';

@Module({
  controllers: [MatchLoveController],
  providers: [MatchLoveService]
})
export class MatchLoveModule {}
