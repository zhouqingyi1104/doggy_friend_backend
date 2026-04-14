import { Controller, Post, Body, Req, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';

export class WeChatLoginDto {
  @ApiProperty({ description: '小程序的 AppID (Alliance Key)', example: 'wx1234567890abcdef' })
  @IsString()
  @IsNotEmpty({ message: 'app_id 不能为空' })
  app_id: string;

  @ApiProperty({ description: '微信端 wx.login 获取的临时登录凭证 code', example: '013xxx112' })
  @IsString()
  @IsNotEmpty({ message: 'code 不能为空' })
  code: string;

  @ApiProperty({ description: '加密算法的初始向量 (iv)', example: 'xyz123=' })
  @IsString()
  @IsNotEmpty({ message: 'iv 不能为空' })
  iv: string;

  @ApiProperty({ description: '包括敏感数据在内的完整用户信息的加密数据', example: 'abc...' })
  @IsString()
  @IsNotEmpty({ message: 'encrypted_data 不能为空' })
  encrypted_data: string;
}

@ApiTags('认证模块 (Auth)')
@Controller('api/wechat')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '微信小程序一键登录', description: '接收小程序登录的 code 和加密数据，解密并返回后端业务系统的 JWT Token' })
  @ApiResponse({ status: 200, description: '成功返回 Token' })
  @ApiResponse({ status: 400, description: '解密失败或参数错误' })
  async apiLogin(@Body() body: WeChatLoginDto) {
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