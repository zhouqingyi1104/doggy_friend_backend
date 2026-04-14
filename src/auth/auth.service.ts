import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WeChatService } from '../wechat/wechat.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly wechatService: WeChatService,
    private readonly jwtService: JwtService,
  ) {}

  async weChatLogin(appId: string, code: string, iv: string, encryptedData: string) {
    // 1. Get WeChat App settings
    const weChatApp = await this.prisma.apps.findFirst({
      where: { alliance_key: appId },
    });

    if (!weChatApp) {
      throw new HttpException('不是有效的key', HttpStatus.BAD_REQUEST);
    }

    // 2. Get session info from WeChat Server and decrypt user info
    const userInfo = await this.wechatService.getSessionInfo(
      weChatApp.app_key,
      weChatApp.app_secret,
      code,
      iv,
      encryptedData,
    );

    // 3. Create or Update user and generate Token
    return this.createApiToken(weChatApp.id, userInfo);
  }

  async createApiToken(appId: bigint, userInfo: any) {
    // Check if user already exists
    let user = await this.prisma.users.findFirst({
      where: {
        app_id: appId,
        open_id: userInfo.openId,
      },
      orderBy: { created_at: 'asc' },
    });

    if (!user) {
      // Create new user
      user = await this.prisma.users.create({
        data: {
          app_id: appId,
          open_id: userInfo.openId,
          union_id: userInfo.unionId || '',
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          gender: userInfo.gender,
          country: userInfo.country || '无',
          province: userInfo.province || '无',
          city: userInfo.city || '无',
          language: userInfo.language || 'zh_CN',
          type: 1,
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    } else {
      // Update existing user (optional in original, but good practice to sync latest profile)
      user = await this.prisma.users.update({
        where: { id: user.id },
        data: {
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl,
          updated_at: new Date(),
        },
      });
    }

    // Generate JWT token
    const payload = { sub: Number(user.id), open_id: user.open_id, app_id: Number(user.app_id) };
    const token = this.jwtService.sign(payload);

    return token;
  }
}