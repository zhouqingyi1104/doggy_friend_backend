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
exports.FollowService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FollowService = class FollowService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggleFollow(userId, objId, objType) {
        const existing = await this.prisma.follows.findFirst({
            where: {
                user_id: userId,
                obj_id: objId,
                obj_type: objType,
            },
        });
        if (existing) {
            const newStatus = existing.status === 1 ? 0 : 1;
            await this.prisma.follows.update({
                where: { id: existing.id },
                data: {
                    status: newStatus,
                    updated_at: new Date(),
                },
            });
            if (objType === 1) {
                await this.prisma.users.update({
                    where: { id: userId },
                    data: { follow_num: { increment: newStatus === 1 ? 1 : -1 } },
                });
                await this.prisma.users.update({
                    where: { id: objId },
                    data: { fans_num: { increment: newStatus === 1 ? 1 : -1 } },
                });
            }
            return { status: newStatus };
        }
        else {
            await this.prisma.follows.create({
                data: {
                    user_id: userId,
                    obj_id: objId,
                    obj_type: objType,
                    status: 1,
                    follow_nickname: '',
                    follow_avatar: '',
                    be_follow_nickname: '',
                    be_follow_avatar: '',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            if (objType === 1) {
                await this.prisma.users.update({
                    where: { id: userId },
                    data: { follow_num: { increment: 1 } },
                });
                await this.prisma.users.update({
                    where: { id: objId },
                    data: { fans_num: { increment: 1 } },
                });
            }
            return { status: 1 };
        }
    }
    async checkFollow(userId, objId, objType) {
        const follow = await this.prisma.follows.findFirst({
            where: {
                user_id: userId,
                obj_id: objId,
                obj_type: objType,
            },
        });
        return { has_follow: follow ? follow.status === 1 : false };
    }
    async getFollowPage(userId, type, pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        let whereClause = { obj_type: 5 };
        if (type === 1) {
            whereClause.user_id = userId;
            whereClause.status = 1;
        }
        else if (type === 2) {
            whereClause.obj_id = userId;
            whereClause.status = 1;
        }
        const items = await this.prisma.follows.findMany({
            where: whereClause,
            skip,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        const total = await this.prisma.follows.count({ where: whereClause });
        const formatted = items.map(item => ({
            ...item,
            id: item.id.toString(),
            user_id: item.user_id.toString(),
            obj_id: item.obj_id.toString(),
        }));
        return {
            page_data: formatted,
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
};
exports.FollowService = FollowService;
exports.FollowService = FollowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FollowService);
//# sourceMappingURL=follow.service.js.map