import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat/follow')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async toggleFollow(
    @Req() req,
    @Body() body: { obj_id: string; obj_type: number }
  ) {
    return this.followService.toggleFollow(
      req.user.id,
      BigInt(body.obj_id),
      body.obj_type || 1, // 1 for user, 2 for other objects
    );
  }

  @Post('follow/check')
  async checkFollow(
    @Req() req,
    @Body() body: { obj_id: string; obj_type: number }
  ) {
    return this.followService.checkFollow(
      req.user.id,
      BigInt(body.obj_id),
      body.obj_type || 1,
    );
  }
}