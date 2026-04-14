import { Controller, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

class WeChatLoginDto {
  app_id: string;
  code: string;
  iv: string;
  encrypted_data: string;
}

@Controller('api/wechat')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async apiLogin(@Body() body: WeChatLoginDto) {
    if (!body.app_id || !body.code || !body.iv || !body.encrypted_data) {
      throw new HttpException('缺少必要的登录参数', HttpStatus.BAD_REQUEST);
    }

    try {
      const token = await this.authService.weChatLogin(
        body.app_id,
        body.code,
        body.iv,
        body.encrypted_data,
      );

      return {
        code: 200,
        message: 'success',
        data: token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(error.message || '内部错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}