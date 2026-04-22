import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat/utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('check_text')
  async checkText(@Request() req, @Body('content') content: string) {
    if (!content) {
      throw new HttpException('内容不能为空', HttpStatus.BAD_REQUEST);
    }
    await this.utilsService.checkText(req.user.app_id, content);
    return { message: '检测通过' };
  }
}
