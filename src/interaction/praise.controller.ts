import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PraiseService } from './praise.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat/praise')
@UseGuards(JwtAuthGuard)
export class PraiseController {
  constructor(private readonly praiseService: PraiseService) {}

  @Post()
  async store(
    @Req() req,
    @Body() body: { obj_id: string; obj_type: number }
  ) {
    const user = req.user;
    const result = await this.praiseService.createPraise(
      user.id,
      BigInt(body.obj_id),
      body.obj_type || 1, // Default to Post
    );

    return result;
  }
}