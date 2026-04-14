"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const wechat_service_1 = require("../wechat/wechat.service");
let AuthService = class AuthService {
    prisma;
    wechatService;
    jwtService;
    constructor(prisma, wechatService, jwtService) {
        this.prisma = prisma;
        this.wechatService = wechatService;
        this.jwtService = jwtService;
    }
    async weChatLogin(appId, code, iv, encryptedData) {
        const weChatApp = await this.prisma.apps.findFirst({
            where: { alliance_key: appId },
        });
        if (!weChatApp) {
            throw new common_1.HttpException('不是有效的key', common_1.HttpStatus.BAD_REQUEST);
        }
        const userInfo = await this.wechatService.getSessionInfo(weChatApp.app_key, weChatApp.app_secret, code, iv, encryptedData);
        return this.createApiToken(weChatApp.id, userInfo);
    }
    async createApiToken(appId, userInfo) {
        let user = await this.prisma.users.findFirst({
            where: {
                app_id: appId,
                open_id: userInfo.openId,
            },
            orderBy: { created_at: 'asc' },
        });
        if (!user) {
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
        }
        else {
            user = await this.prisma.users.update({
                where: { id: user.id },
                data: {
                    nickname: userInfo.nickName,
                    avatar: userInfo.avatarUrl,
                    updated_at: new Date(),
                },
            });
        }
        const payload = { sub: Number(user.id), open_id: user.open_id, app_id: Number(user.app_id) };
        const token = this.jwtService.sign(payload);
        return token;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        wechat_service_1.WeChatService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map