import { Controller, Get, UseGuards } from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
export class QiniuController {
  constructor(private readonly qiniuService: QiniuService) {}

  @Get('upload_token')
  @UseGuards(JwtAuthGuard) // Require login to get upload token
  getUploadToken() {
    const token = this.qiniuService.getUploadToken();
    return { error_code: 0, data: { uptoken: token } };
  }
}