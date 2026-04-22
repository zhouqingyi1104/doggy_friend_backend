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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentService = class CommentService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createComment(userId, objId, content, objType, refCommentId, attachments, collegeId) {
        if (!content && !attachments) {
            throw new common_1.HttpException('评论内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        const comment = await this.prisma.comments.create({
            data: {
                commenter_id: userId,
                obj_id: objId,
                content: content || '',
                obj_type: objType,
                ref_comment_id: refCommentId,
                attachments: attachments || '',
                college_id: collegeId,
                status: 0,
                type: 0,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        if (objType === 1) {
            await this.prisma.posts.update({
                where: { id: objId },
                data: { comment_number: { increment: 1 } },
            });
        }
        else if (objType === 2) {
            await this.prisma.sale_friends.update({
                where: { id: objId },
                data: { comment_number: { increment: 1 } },
            });
        }
        else if (objType === 3) {
            await this.prisma.match_loves.update({
                where: { id: objId },
                data: { comment_number: { increment: 1 } },
            });
        }
        else if (objType === 5) {
            await this.prisma.topics.update({
                where: { id: objId },
                data: { comment_number: { increment: 1 } },
            });
        }
        return comment;
    }
    async getComments(objId, objType, pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        const [comments, total] = await Promise.all([
            this.prisma.comments.findMany({
                where: {
                    obj_id: objId,
                    obj_type: objType,
                },
                skip,
                take: pageSize,
                orderBy: { created_at: 'asc' },
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
            this.prisma.comments.count({
                where: {
                    obj_id: objId,
                    obj_type: objType,
                },
            }),
        ]);
        const refCommentIds = comments.map(c => c.ref_comment_id).filter(id => id !== null);
        let refCommentsMap = new Map();
        if (refCommentIds.length > 0) {
            const refComments = await this.prisma.comments.findMany({
                where: { id: { in: refCommentIds } },
                include: { users: { select: { id: true, nickname: true } } }
            });
            refComments.forEach(ref => {
                refCommentsMap.set(ref.id.toString(), { id: ref.id, content: ref.content, user: ref.users });
            });
        }
        const formatted = comments.map((comment) => {
            let refComment = null;
            if (comment.ref_comment_id) {
                refComment = refCommentsMap.get(comment.ref_comment_id.toString()) || null;
            }
            return {
                ...comment,
                commenter: comment.users,
                users: undefined,
                ref_comment: refComment,
                attachments: comment.attachments ? comment.attachments.split(',') : [],
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
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
//# sourceMappingURL=comment.service.js.map