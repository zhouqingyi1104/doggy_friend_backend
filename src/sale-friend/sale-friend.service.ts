import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SaleFriendService {
  constructor(private readonly prisma: PrismaService) {}

  async createSaleFriend(
    ownerId: bigint,
    collegeId: bigint,
    name: string,
    gender: number,
    major: string,
    expectation: string,
    introduce: string,
    attachments: string,
  ) {
    if (!name || !introduce) {
      throw new HttpException('名字和介绍不能为空', HttpStatus.BAD_REQUEST);
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

  async getSaleFriendsList(
    appId: bigint,
    currentUserId: bigint,
    pageSize: number = 10,
    pageNumber: number = 1,
    type: number = 1, // 1: all, 2: follow
    justMe: boolean = false,
    orderBy: string = 'created_at',
    sortBy: string = 'desc',
    targetUserId?: bigint,
    collegeId?: bigint,
  ) {
    const skip = (pageNumber - 1) * pageSize;
    const whereClause: any = { status: 1 };

    // App isolation
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

    // Following (type 2)
    if (type === 2) {
      const follows = await this.prisma.follows.findMany({
        where: { user_id: currentUserId, status: 1 },
        select: { obj_id: true }, // assuming obj_id is the user being followed
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

    // check praises
    const praises = await this.prisma.praises.findMany({
      where: {
        owner_id: currentUserId,
        obj_id: { in: itemIds },
        obj_type: 2, // 2 for sale friend
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

  async getMostNewSaleFriends(appId: bigint, currentUserId: bigint) {
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

  async getSaleFriendDetail(id: bigint, currentUserId: bigint) {
    const item = await this.prisma.sale_friends.findUnique({
      where: { id },
      include: {
        users: { select: { id: true, nickname: true, avatar: true, gender: true } }
      }
    });

    if (!item) {
      throw new HttpException('记录不存在', HttpStatus.NOT_FOUND);
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

  async deleteSaleFriend(id: bigint, currentUserId: bigint) {
    const item = await this.prisma.sale_friends.findUnique({ where: { id } });
    if (!item || item.owner_id !== currentUserId) {
      throw new HttpException('无权删除', HttpStatus.FORBIDDEN);
    }

    await this.prisma.sale_friends.delete({ where: { id } });
    return 1;
  }
}
