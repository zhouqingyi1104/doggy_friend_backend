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
exports.SaleFriendService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SaleFriendService = class SaleFriendService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createSaleFriend(ownerId, collegeId, name, gender, major, expectation, introduce, attachments) {
        if (!name || !introduce) {
            throw new common_1.HttpException('名字和介绍不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.prisma.sale_friends.create({
            data: {
                owner_id: ownerId,
                college_id: collegeId || null,
                name,
                gender: gender || 1,
                major: major || '无',
                expectation: expectation || '无',
                introduce,
                attachments: attachments || '',
                type: 1,
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return result;
    }
    async getSaleFriendsList(appId, currentUserId, pageSize = 10, pageNumber = 1, type = 1, justMe = false, orderBy = 'created_at', sortBy = 'desc', targetUserId, collegeId) {
        const skip = (pageNumber - 1) * pageSize;
        const whereClause = { status: 1 };
        whereClause.users = { app_id: appId };
        if (collegeId) {
            whereClause.college_id = collegeId;
        }
        if (justMe) {
            whereClause.owner_id = currentUserId;
        }
        if (targetUserId) {
            whereClause.owner_id = targetUserId;
        }
        if (type === 2) {
            const follows = await this.prisma.follows.findMany({
                where: { user_id: currentUserId, status: 1 },
                select: { obj_id: true },
            });
            const followIds = follows.map(f => f.obj_id);
            whereClause.owner_id = { in: followIds };
        }
        const sortConfig = {};
        sortConfig[orderBy || 'created_at'] = sortBy || 'desc';
        const [items, total] = await Promise.all([
            this.prisma.sale_friends.findMany({
                where: whereClause,
                skip,
                take: pageSize,
                orderBy: sortConfig,
                include: {
                    users: {
                        select: { id: true, nickname: true, avatar: true, gender: true },
                    },
                },
            }),
            this.prisma.sale_friends.count({ where: whereClause }),
        ]);
        const itemIds = items.map(i => i.id);
        const praises = await this.prisma.praises.findMany({
            where: {
                owner_id: currentUserId,
                obj_id: { in: itemIds },
                obj_type: 2,
            },
        });
        const praisedIds = new Set(praises.map(p => p.obj_id.toString()));
        const formatted = items.map(item => {
            return {
                ...item,
                users: undefined,
                poster: item.users,
                has_praise: praisedIds.has(item.id.toString()),
                attachments: item.attachments ? item.attachments.split(',') : [],
            };
        });
        return {
            page_data: formatted,
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
    async getMostNewSaleFriends(appId, currentUserId) {
        const items = await this.prisma.sale_friends.findMany({
            where: { status: 1, users: { app_id: appId } },
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                users: { select: { id: true, nickname: true, avatar: true, gender: true } }
            }
        });
        const formatted = items.map(item => {
            return {
                ...item,
                users: undefined,
                poster: item.users,
                attachments: item.attachments ? item.attachments.split(',') : [],
            };
        });
        return formatted;
    }
    async getSaleFriendDetail(id, currentUserId) {
        const item = await this.prisma.sale_friends.findUnique({
            where: { id },
            include: {
                users: { select: { id: true, nickname: true, avatar: true, gender: true } }
            }
        });
        if (!item) {
            throw new common_1.HttpException('记录不存在', common_1.HttpStatus.NOT_FOUND);
        }
        const praise = await this.prisma.praises.findFirst({
            where: { owner_id: currentUserId, obj_id: id, obj_type: 2 }
        });
        return {
            ...item,
            users: undefined,
            poster: item.users,
            has_praise: !!praise,
            attachments: item.attachments ? item.attachments.split(',') : [],
        };
    }
    async deleteSaleFriend(id, currentUserId) {
        const item = await this.prisma.sale_friends.findUnique({ where: { id } });
        if (!item || item.owner_id !== currentUserId) {
            throw new common_1.HttpException('无权删除', common_1.HttpStatus.FORBIDDEN);
        }
        await this.prisma.sale_friends.delete({ where: { id } });
        return 1;
    }
};
exports.SaleFriendService = SaleFriendService;
exports.SaleFriendService = SaleFriendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SaleFriendService);
//# sourceMappingURL=sale-friend.service.js.map