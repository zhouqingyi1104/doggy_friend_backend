import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { InboxModule } from '../inbox/inbox.module';

@Module({
  imports: [InboxModule],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
