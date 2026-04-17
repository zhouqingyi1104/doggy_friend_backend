import { Controller, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CompareFaceService } from './compare-face.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class CompareFaceController {
  constructor(private readonly compareFaceService: CompareFaceService) {}

  @Post('compare_face')
  async compareFace(
    @Req() req,
    @Body() body: { your_face: string; his_face: string }
  ) {
    if (!body.your_face || !body.his_face) {
      throw new HttpException('照片不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.compareFaceService.compareFace(req.user.id, body.your_face, body.his_face);
  }

  @Post('anime_face')
  async animeFace(
    @Req() req,
    @Body() body: { image: string }
  ) {
    if (!body.image) {
      throw new HttpException('图片不能为空', HttpStatus.BAD_REQUEST);
    }
    return this.compareFaceService.getAnimeFace(req.user.id, body.image);
  }
}
