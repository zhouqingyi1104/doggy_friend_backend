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
        let whereClause = {};
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
                id: '0',
                nickname: '匿名同学',
                avatar: 'https://image.kucaroom.com/niming.png',
                gender: 0,
            } : {
                ...post.users,
                id: post.users?.id?.toString() || '0'
            };
            return {
                ...post,
                id: post.id.toString(),
                poster_id: post.poster_id.toString(),
                college_id: post.college_id?.toString() || null,
                users: undefined,
                poster,
                has_praise: praisedPostIds.has(post.id.toString()),
                attachments: post.attachments ? post.attachments.split(',') : [],
            };
        });
        return {
            page_data: formattedPosts,
            total,
            page: pageNumber,
            page_size: pageSize,
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
            id: '0',
            nickname: '匿名同学',
            avatar: 'https://image.kucaroom.com/niming.png',
            gender: 0,
        } : {
            ...post.users,
            id: post.users?.id?.toString() || '0'
        };
        return {
            ...post,
            id: post.id.toString(),
            poster_id: post.poster_id.toString(),
            college_id: post.college_id?.toString() || null,
            users: undefined,
            poster,
            has_praise: !!praise,
            attachments: post.attachments ? post.attachments.split(',') : [],
        };
    }
    async getLatestTopic(appId) {
        const numericAppId = Number(appId);
        console.log('Searching for topic with app_id:', numericAppId);
        const topic = await this.prisma.topics.findFirst({
            where: {
                app_id: numericAppId,
                status: 2,
            },
            orderBy: { created_at: 'desc' },
        });
        console.log('Found topic:', topic);
        if (!topic) {
            return null;
        }
        return {
            ...topic,
            id: topic.id.toString(),
            user_id: topic.user_id.toString(),
            attachments: topic.attachments ? topic.attachments.split(',') : [],
            praise_number: topic.praise_number.toString(),
            view_number: topic.view_number.toString(),
            comment_number: topic.comment_number.toString(),
        };
    }
    async getTopicDetail(topicId) {
        const topic = await this.prisma.topics.findUnique({
            where: { id: topicId },
        });
        if (!topic) {
            throw new common_1.HttpException('话题不存在', common_1.HttpStatus.NOT_FOUND);
        }
        await this.prisma.topics.update({
            where: { id: topicId },
            data: { view_number: { increment: 1 } },
        });
        return {
            ...topic,
            id: topic.id.toString(),
            user_id: topic.user_id.toString(),
            attachments: topic.attachments ? topic.attachments.split(',') : [],
            praise_number: topic.praise_number.toString(),
            view_number: (topic.view_number + 1n).toString(),
            comment_number: topic.comment_number.toString(),
        };
    }
    async getTopicComments(topicId, pageSize, pageNumber) {
        const skip = (pageNumber - 1) * pageSize;
        const [comments, total] = await Promise.all([
            this.prisma.comments.findMany({
                where: {
                    obj_id: topicId,
                    obj_type: 5,
                },
                skip,
                take: pageSize,
                orderBy: { created_at: 'desc' },
                include: {
                    users: {
                        select: { id: true, nickname: true, avatar: true, gender: true, type: true },
                    },
                },
            }),
            this.prisma.comments.count({
                where: { obj_id: topicId, obj_type: 5 },
            }),
        ]);
        const formatted = await this.formatComments(comments);
        return {
            page_data: formatted,
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
    async getTopicNewComments(topicId, time) {
        const comments = await this.prisma.comments.findMany({
            where: {
                obj_id: topicId,
                obj_type: 5,
                created_at: { gte: new Date(time) },
            },
            take: 10,
            orderBy: { created_at: 'desc' },
            include: {
                users: {
                    select: { id: true, nickname: true, avatar: true, gender: true, type: true },
                },
            },
        });
        return this.formatComments(comments);
    }
    async praiseTopic(topicId) {
        const topic = await this.prisma.topics.findUnique({
            where: { id: topicId },
        });
        if (!topic) {
            throw new common_1.HttpException('话题不存在', common_1.HttpStatus.NOT_FOUND);
        }
        const updated = await this.prisma.topics.update({
            where: { id: topicId },
            data: { praise_number: { increment: 1 } },
        });
        return {
            ...updated,
            id: updated.id.toString(),
            user_id: updated.user_id.toString(),
            praise_number: updated.praise_number.toString(),
            view_number: updated.view_number.toString(),
            comment_number: updated.comment_number.toString(),
        };
    }
    async formatComments(comments) {
        const commentIds = comments.map(c => c.id);
        const subComments = await this.prisma.comments.findMany({
            where: {
                obj_id: { in: commentIds },
                obj_type: 4,
            },
            orderBy: { created_at: 'asc' },
            include: {
                users: { select: { id: true, nickname: true, avatar: true, type: true } },
            },
        });
        const subCommentsMap = new Map();
        const allRefCommentIds = new Set();
        subComments.forEach(sc => {
            if (sc.ref_comment_id)
                allRefCommentIds.add(sc.ref_comment_id);
            const arr = subCommentsMap.get(sc.obj_id.toString()) || [];
            arr.push(sc);
            subCommentsMap.set(sc.obj_id.toString(), arr);
        });
        let refCommentsMap = new Map();
        if (allRefCommentIds.size > 0) {
            const refComments = await this.prisma.comments.findMany({
                where: { id: { in: Array.from(allRefCommentIds) } },
                include: { users: { select: { id: true, nickname: true, avatar: true, type: true } } },
            });
            refComments.forEach(rc => {
                refCommentsMap.set(rc.id.toString(), rc);
            });
        }
        return comments.map(comment => {
            const subs = subCommentsMap.get(comment.id.toString()) || [];
            const formattedSubs = subs.map((sub) => {
                const rc = sub.ref_comment_id ? refCommentsMap.get(sub.ref_comment_id.toString()) : null;
                return {
                    ...sub,
                    id: sub.id.toString(),
                    commenter_id: sub.commenter_id.toString(),
                    obj_id: sub.obj_id.toString(),
                    commenter: {
                        id: sub.users?.id?.toString() || '0',
                        nickname: sub.users?.nickname,
                        avatar: sub.users?.avatar,
                        supertube: sub.users?.type === 2 ? 1 : 0,
                    },
                    ref_comment: rc ? {
                        ...rc,
                        id: rc.id.toString(),
                        commenter_id: rc.commenter_id.toString(),
                        refCommenter: {
                            id: rc.users?.id?.toString() || '0',
                            nickname: rc.users?.nickname,
                            avatar: rc.users?.avatar,
                            admin: 0,
                        }
                    } : '',
                    can_delete: true,
                };
            });
            return {
                ...comment,
                id: comment.id.toString(),
                commenter_id: comment.commenter_id.toString(),
                obj_id: comment.obj_id.toString(),
                commenter: {
                    id: comment.users?.id?.toString() || '0',
                    nickname: comment.users?.nickname,
                    avatar: comment.users?.avatar,
                    supertube: comment.users?.type === 2 ? 1 : 0,
                },
                sub_comments: formattedSubs,
                can_delete: true,
            };
        });
    }
};
exports.PostService = PostService;
exports.PostService = PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
//# sourceMappingURL=post.service.js.map