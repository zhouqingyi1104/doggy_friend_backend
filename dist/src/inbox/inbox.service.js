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
exports.InboxService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InboxService = class InboxService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async send(fromId, toId, objId, content, objType, actionType, postAt) {
        return this.prisma.inboxes.create({
            data: {
                from_id: fromId,
                to_id: toId,
                obj_id: objId,
                content: content || '',
                obj_type: objType,
                action_type: actionType,
                private: false,
                post_at: postAt,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    async getNewInboxCount(userId, type) {
        const typeInt = parseInt(type, 10);
        return this.prisma.inboxes.count({
            where: {
                to_id: userId,
                action_type: typeInt,
                read_at: null,
            },
        });
    }
    async getUserInbox(userId, type, messageType, pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        const typeInt = parseInt(type, 10);
        const inboxes = await this.prisma.inboxes.findMany({
            where: {
                to_id: userId,
                action_type: typeInt,
            },
            skip,
            take: pageSize,
            orderBy: { created_at: 'desc' },
        });
        const total = await this.prisma.inboxes.count({
            where: {
                to_id: userId,
                action_type: typeInt,
            },
        });
        const unreadIds = inboxes.filter(i => !i.read_at).map(i => i.id);
        if (unreadIds.length > 0) {
            await this.prisma.inboxes.updateMany({
                where: { id: { in: unreadIds } },
                data: { read_at: new Date() },
            });
        }
        const fromUserIds = [...new Set(inboxes.map(i => i.from_id))];
        const users = await this.prisma.users.findMany({
            where: { id: { in: fromUserIds } },
            select: { id: true, nickname: true, avatar: true },
        });
        const userMap = new Map();
        users.forEach(u => userMap.set(u.id.toString(), u));
        const formatted = inboxes.map(inbox => {
            return {
                ...inbox,
                from_user: userMap.get(inbox.from_id.toString()) || null,
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
};
exports.InboxService = InboxService;
exports.InboxService = InboxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InboxService);
//# sourceMappingURL=inbox.service.js.map