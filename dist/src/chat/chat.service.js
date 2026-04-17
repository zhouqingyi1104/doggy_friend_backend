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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const inbox_service_1 = require("../inbox/inbox.service");
let ChatService = class ChatService {
    prisma;
    inboxService;
    constructor(prisma, inboxService) {
        this.prisma = prisma;
        this.inboxService = inboxService;
    }
    async sendMessage(userId, friendId, content, attachments) {
        if (!content && !attachments) {
            throw new common_1.HttpException('消息内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        const postAt = new Date();
        const displayContent = content ? content : '收到一张图片';
        const message = await this.prisma.$transaction(async (tx) => {
            const existingFriend1 = await tx.friends.findFirst({
                where: { user_id: userId, friend_id: friendId },
            });
            if (!existingFriend1) {
                await tx.friends.create({
                    data: { user_id: userId, friend_id: friendId },
                });
            }
            const existingFriend2 = await tx.friends.findFirst({
                where: { user_id: friendId, friend_id: userId },
            });
            if (!existingFriend2) {
                await tx.friends.create({
                    data: { user_id: friendId, friend_id: userId },
                });
            }
            const newMsg = await tx.chat_messages.create({
                data: {
                    from_user_id: userId,
                    to_user_id: friendId,
                    content: content || '',
                    attachments: attachments || '',
                    type: 1,
                    status: 1,
                    post_at: postAt,
                    created_at: postAt,
                    updated_at: postAt,
                },
            });
            await tx.inboxes.create({
                data: {
                    from_id: userId,
                    to_id: friendId,
                    obj_id: friendId,
                    content: displayContent,
                    obj_type: 4,
                    action_type: 2,
                    private: false,
                    post_at: postAt,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            return newMsg;
        });
        return message;
    }
    async getChatList(userId, friendId, pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        const messages = await this.prisma.chat_messages.findMany({
            where: {
                OR: [
                    { from_user_id: userId, to_user_id: friendId },
                    { from_user_id: friendId, to_user_id: userId },
                ],
            },
            orderBy: { created_at: 'desc' },
            skip,
            take: pageSize,
        });
        const total = await this.prisma.chat_messages.count({
            where: {
                OR: [
                    { from_user_id: userId, to_user_id: friendId },
                    { from_user_id: friendId, to_user_id: userId },
                ],
            },
        });
        const unreadIds = messages.filter(m => !m.read_at && m.to_user_id === userId).map(m => m.id);
        if (unreadIds.length > 0) {
            await this.prisma.chat_messages.updateMany({
                where: { id: { in: unreadIds } },
                data: { read_at: new Date() },
            });
        }
        const formatted = messages.map(m => {
            return {
                ...m,
                attachments: m.attachments ? m.attachments.split(',') : [],
            };
        });
        return {
            page_data: formatted.reverse(),
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
    async getNewMessages(userId, friendId) {
        const messages = await this.prisma.chat_messages.findMany({
            where: {
                to_user_id: userId,
                from_user_id: friendId,
                read_at: null,
            },
            orderBy: { created_at: 'desc' },
        });
        if (messages.length > 0) {
            const ids = messages.map(m => m.id);
            await this.prisma.chat_messages.updateMany({
                where: { id: { in: ids } },
                data: { read_at: new Date() },
            });
        }
        const formatted = messages.map(m => ({
            ...m,
            attachments: m.attachments ? m.attachments.split(',') : [],
        }));
        return formatted.reverse();
    }
    async getNewLetterCount(userId) {
        return this.prisma.chat_messages.count({
            where: {
                to_user_id: userId,
                read_at: null,
            },
        });
    }
    async getFriends(userId) {
        const friends = await this.prisma.friends.findMany({
            where: { user_id: userId, status: 1 },
        });
        const friendIds = friends.map(f => f.friend_id);
        const users = await this.prisma.users.findMany({
            where: { id: { in: friendIds } },
            select: {
                id: true,
                nickname: true,
                avatar: true,
                gender: true,
            },
        });
        const unreadCounts = await this.prisma.chat_messages.groupBy({
            by: ['from_user_id'],
            where: {
                to_user_id: userId,
                read_at: null,
                from_user_id: { in: friendIds },
            },
            _count: {
                id: true,
            },
        });
        const unreadMap = new Map();
        unreadCounts.forEach(item => unreadMap.set(item.from_user_id.toString(), item._count.id));
        return users.map(u => ({
            ...u,
            unread_count: unreadMap.get(u.id.toString()) || 0,
        }));
    }
    async deleteMessage(userId, messageId) {
        const message = await this.prisma.chat_messages.findUnique({
            where: { id: messageId },
        });
        if (!message || message.from_user_id !== userId) {
            throw new common_1.HttpException('无权删除此消息', common_1.HttpStatus.FORBIDDEN);
        }
        await this.prisma.chat_messages.delete({
            where: { id: messageId },
        });
        return 1;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        inbox_service_1.InboxService])
], ChatService);
//# sourceMappingURL=chat.service.js.map