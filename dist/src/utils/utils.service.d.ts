import { WeChatService } from '../wechat/wechat.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class UtilsService {
    private readonly wechatService;
    private readonly prisma;
    constructor(wechatService: WeChatService, prisma: PrismaService);
    checkText(appId: number, content: string): Promise<boolean>;
}
