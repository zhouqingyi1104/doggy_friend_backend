import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { WeChatService } from '../wechat/wechat.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilsService {
  constructor(
    private readonly wechatService: WeChatService,
    private readonly prisma: PrismaService,
  ) {}

  async checkText(appId: number, content: string) {
    const weChatApp = await this.prisma.apps.findFirst({
      where: { id: appId },
    });

    if (!weChatApp) {
      throw new HttpException('未找到配置的小程序信息', HttpStatus.BAD_REQUEST);
    }

    return this.wechatService.checkText(weChatApp.app_key, weChatApp.app_secret, content);
  }
}
