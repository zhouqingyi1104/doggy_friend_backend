import { Controller, Get, Post, Delete, Body, Req, Param, Query, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send/:id/message')
  async sendMessage(
    @Req() req,
    @Param('id') friendId: string,
    @Body() body: { content?: string; attachments?: string | string[] }
  ) {
    const attachmentsStr = Array.isArray(body.attachments) ? body.attachments.join(',') : (body.attachments || '');
    return this.chatService.sendMessage(
      req.user.id,
      BigInt(friendId),
      body.content || '',
      attachmentsStr,
    );
  }

  @Get('message/:id/list')
  async chatList(
    @Req() req,
    @Param('id') friendId: string,
    @Query('page_size') pageSize?: string,
    @Query('page_number') pageNumber?: string
  ) {
    return this.chatService.getChatList(
      req.user.id,
      BigInt(friendId),
      parseInt(pageSize || '10', 10),
      parseInt(pageNumber || '1', 10)
    );
  }

  @Get('new_messages')
  async newLetter(@Req() req) {
    return this.chatService.getNewLetterCount(req.user.id);
  }

  @Get('new/:id/messages')
  async getNewMessage(@Req() req, @Param('id') friendId: string) {
    return this.chatService.getNewMessages(req.user.id, BigInt(friendId));
  }

  @Get('friends')
  async friends(@Req() req) {
    return this.chatService.getFriends(req.user.id);
  }

  @Delete('delete/:id/chat_message')
  async deleteMessage(@Req() req, @Param('id') messageId: string) {
    return this.chatService.deleteMessage(req.user.id, BigInt(messageId));
  }
}
