import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WeChatService } from '../wechat/wechat.service';
export declare class AuthService {
    private readonly prisma;
    private readonly wechatService;
    private readonly jwtService;
    constructor(prisma: PrismaService, wechatService: WeChatService, jwtService: JwtService);
    weChatLogin(appId: string, code: string, iv: string, encryptedData: string): Promise<string>;
    createApiToken(appId: bigint, userInfo: any): Promise<string>;
}
