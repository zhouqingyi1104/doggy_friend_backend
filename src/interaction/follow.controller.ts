import { Controller, Get, Post, Put, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow')
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

  @Get('follow/user')
  async checkFollowUser(
    @Req() req,
    @Query('obj_id') objId: string
  ) {
    return this.followService.checkFollow(
      req.user.id,
      BigInt(objId),
      1, // 1 for user
    );
  }

  @Post('follow_user')
  async followUser(
    @Req() req,
    @Body() body: { obj_id: string }
  ) {
    return this.followService.toggleFollow(
      req.user.id,
      BigInt(body.obj_id),
      1, // 1 for user
    );
  }

  @Put('cancel/:id/follow/:type')
  async cancelFollow(@Param('id') id: string, @Param('type') type: string) {
    return { error_code: 0, data: null };
  }
}
