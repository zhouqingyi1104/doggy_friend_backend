import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(
    userId: bigint,
    objId: bigint,
    content: string,
    objType: number,
    refCommentId?: bigint,
    attachments?: string,
    collegeId?: bigint,
  ) {
    if (!content && !attachments) {
      throw new HttpException('评论内容不能为空', HttpStatus.BAD_REQUEST);
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

    // Increment comment count on the object
    if (objType === 1) {
      await this.prisma.posts.update({
        where: { id: objId },
        data: { comment_number: { increment: 1 } },
      });
    } else if (objType === 2) {
      await this.prisma.sale_friends.update({
        where: { id: objId },
        data: { comment_number: { increment: 1 } },
      });
    } else if (objType === 3) {
      await this.prisma.match_loves.update({
        where: { id: objId },
        data: { comment_number: { increment: 1 } },
      });
    } else if (objType === 5) {
      await this.prisma.topics.update({
        where: { id: objId },
        data: { comment_number: { increment: 1 } },
      });
    }

    // Inbox notification would go here

    return comment;
  }

  async getComments(objId: bigint, objType: number, pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;

    const [comments, total] = await Promise.all([
      this.prisma.comments.findMany({
        where: {
          obj_id: objId,
          obj_type: objType,
        },
        skip,
        take: pageSize,
        orderBy: { created_at: 'asc' }, // Older comments first
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

    // Bulk fetch ref comments to fix N+1 issue
    const refCommentIds = comments.map(c => c.ref_comment_id).filter(id => id !== null);
    let refCommentsMap = new Map();

    if (refCommentIds.length > 0) {
      const refComments = await this.prisma.comments.findMany({
        where: { id: { in: refCommentIds as bigint[] } },
        include: { users: { select: { id: true, nickname: true } } }
      });
      refComments.forEach(ref => {
        refCommentsMap.set(ref.id.toString(), { id: ref.id, content: ref.content, user: ref.users });
      });
    }

    // Format response and handle replied comments
    const formatted = comments.map((comment) => {
      let refComment: any = null;
      if (comment.ref_comment_id) {
        refComment = refCommentsMap.get(comment.ref_comment_id.toString()) || null;
      }

      return {
        ...comment,
        commenter: comment.users, // rename users to commenter
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
}