import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { InboxService } from './inbox.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class InboxController {
  constructor(private readonly inboxService: InboxService) {}

  @Get('new/:type/inbox')
  async getNewInbox(@Req() req, @Param('type') type: string) {
    const count = await this.inboxService.getNewInboxCount(req.user.id, type);
    return count;
  }

  @Get('user/:type/inbox/:messageType')
  async userInbox(
    @Req() req,
    @Param('type') type: string,
    @Param('messageType') messageType: string,
    @Query('page_size') pageSize?: string,
    @Query('page_number') pageNumber?: string,
  ) {
    return this.inboxService.getUserInbox(
      req.user.id,
      type,
      messageType,
      parseInt(pageSize || '10', 10),
      parseInt(pageNumber || '1', 10)
    );
  }
}
