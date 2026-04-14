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
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let PostService = class PostService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPost(userId, collegeId, content, attachments, topic, isPrivate) {
        if (!content && !attachments) {
            throw new common_1.HttpException('内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        const post = await this.prisma.posts.create({
            data: {
                poster_id: userId,
                college_id: collegeId,
                content: content || '',
                attachments: attachments || '',
                topic: topic || '无',
                private: isPrivate || 0,
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        await this.prisma.users.update({
            where: { id: userId },
            data: { post_num: { increment: 1 } },
        });
        return post;
    }
    async getPostList(appId, currentUserId, pageSize = 10, pageNumber = 1, type, justMe, filter, targetUserId) {
        const skip = (pageNumber - 1) * pageSize;
        const whereClause = {};
        whereClause.users = { app_id: appId };
        if (justMe) {
            whereClause.poster_id = currentUserId;
        }
        if (targetUserId) {
            whereClause.poster_id = targetUserId;
        }
        if (type === 2) {
            const follows = await this.prisma.follows.findMany({
                where: { user_id: currentUserId, status: 1 },
                select: { obj_id: true },
            });
            const followUserIds = follows.map(f => f.obj_id);
            whereClause.poster_id = { in: followUserIds };
        }
        if (filter) {
            whereClause.OR = [
                { topic: { contains: filter } },
                { content: { contains: filter } },
                {
                    private: 0,
                    users: { nickname: { contains: filter } },
                },
            ];
        }
        const [posts, total] = await Promise.all([
            this.prisma.posts.findMany({
                where: whereClause,
                skip,
                take: Number(pageSize),
                orderBy: type === 4 ? { praise_number: 'desc' } : { created_at: 'desc' },
                include: {
                    users: {
                        select: {
                            id: true,
                            nickname: true,
                            avatar: true,
                            gender: true,
                        },
                    },
                },
            }),
            this.prisma.posts.count({ where: whereClause }),
        ]);
        const postIds = posts.map(p => p.id);
        const praises = await this.prisma.praises.findMany({
            where: {
                owner_id: currentUserId,
                obj_id: { in: postIds },
                obj_type: 1,
            },
        });
        const praisedPostIds = new Set(praises.map(p => p.obj_id.toString()));
        const formattedPosts = posts.map((post) => {
            const poster = post.private === 1 ? {
                id: 0,
                nickname: '匿名同学',
                avatar: 'https://image.kucaroom.com/niming.png',
                gender: 0,
            } : post.users;
            return {
                ...post,
                users: undefined,
                poster,
                has_praise: praisedPostIds.has(post.id.toString()),
                attachments: post.attachments ? post.attachments.split(',') : [],
            };
        });
        return {
            data: formattedPosts,
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
    async getPostDetail(postId, currentUserId) {
        const post = await this.prisma.posts.findUnique({
            where: { id: postId },
            include: {
                users: {
                    select: {
                        id: true,
                        nickname: true,
                        avatar: true,
                        gender: true,
                    },
                },
            },
        });
        if (!post) {
            throw new common_1.HttpException('帖子不存在', common_1.HttpStatus.NOT_FOUND);
        }
        return this.formatSinglePost(post, currentUserId);
    }
    async formatSinglePost(post, currentUserId) {
        const praise = await this.prisma.praises.findFirst({
            where: {
                owner_id: currentUserId,
                obj_id: post.id,
                obj_type: 1,
            },
        });
        const poster = post.private === 1 ? {
            id: 0,
            nickname: '匿名同学',
            avatar: 'https://image.kucaroom.com/niming.png',
            gender: 0,
        } : post.users;
        return {
            ...post,
            users: undefined,
            poster,
            has_praise: !!praise,
            attachments: post.attachments ? post.attachments.split(',') : [],
        };
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map