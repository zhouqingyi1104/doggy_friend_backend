import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async createPost(
    userId: bigint,
    collegeId: bigint,
    content: string,
    attachments: string,
    topic: string,
    isPrivate: number,
  ) {
    if (!content && !attachments) {
      throw new HttpException('内容不能为空', HttpStatus.BAD_REQUEST);
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

    // Increment user post_num
    await this.prisma.users.update({
      where: { id: userId },
      data: { post_num: { increment: 1 } },
    });

    return post;
  }

  async getPostList(
    appId: bigint,
    currentUserId: bigint,
    pageSize: number = 10,
    pageNumber: number = 1,
    type?: number, // 1: all, 2: follow, 3: new, 4: hot
    justMe?: boolean,
    filter?: string,
    targetUserId?: bigint,
  ) {
    const skip = (pageNumber - 1) * pageSize;
    const whereClause: any = {};

    // Base filter by app_id (users belonging to the same app)
    whereClause.users = { app_id: appId };

    // Just me
    if (justMe) {
      whereClause.poster_id = currentUserId;
    }

    // Specific user
    if (targetUserId) {
      whereClause.poster_id = targetUserId;
    }

    // Follows (type 2)
    if (type === 2) {
      const follows = await this.prisma.follows.findMany({
        where: { user_id: currentUserId, status: 1 },
        select: { obj_id: true },
      });
      const followUserIds = follows.map(f => f.obj_id);
      whereClause.poster_id = { in: followUserIds };
    }

    // Search filter
    if (filter) {
      whereClause.OR = [
        { topic: { contains: filter } },
        { content: { contains: filter } },
        // If private is 0, allow search by poster's nickname
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
        orderBy: type === 4 ? { praise_number: 'desc' } : { created_at: 'desc' }, // Hot vs New
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

    // Format posts - Optimize N+1 queries by fetching praises in bulk
    const postIds = posts.map(p => p.id);
    
    // Bulk fetch praises
    const praises = await this.prisma.praises.findMany({
      where: {
        owner_id: currentUserId,
        obj_id: { in: postIds },
        obj_type: 1, // 1 for post
      },
    });

    const praisedPostIds = new Set(praises.map(p => p.obj_id.toString()));

    const formattedPosts = posts.map((post) => {
      // Format poster info (handle anonymity)
      const poster = post.private === 1 ? {
        id: 0,
        nickname: '匿名同学',
        avatar: 'https://image.kucaroom.com/niming.png',
        gender: 0,
      } : post.users;

      return {
        ...post,
        users: undefined, // remove raw users relation
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

  async getPostDetail(postId: bigint, currentUserId: bigint) {
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
      throw new HttpException('帖子不存在', HttpStatus.NOT_FOUND);
    }

    return this.formatSinglePost(post, currentUserId);
  }

  private async formatSinglePost(post: any, currentUserId: bigint) {
    // Check if current user has praised
    const praise = await this.prisma.praises.findFirst({
      where: {
        owner_id: currentUserId,
        obj_id: post.id,
        obj_type: 1, // 1 for post
      },
    });

    // Format poster info (handle anonymity)
    const poster = post.private === 1 ? {
      id: 0,
      nickname: '匿名同学',
      avatar: 'https://image.kucaroom.com/niming.png',
      gender: 0,
    } : post.users;

    return {
      ...post,
      users: undefined, // remove raw users relation
      poster,
      has_praise: !!praise,
      attachments: post.attachments ? post.attachments.split(',') : [],
    };
  }
}