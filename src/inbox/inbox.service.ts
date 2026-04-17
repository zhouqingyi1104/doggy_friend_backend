import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async send(
    fromId: bigint,
    toId: bigint,
    objId: bigint,
    content: string,
    objType: number,
    actionType: number,
    postAt: Date,
  ) {
    return this.prisma.inboxes.create({
      data: {
        from_id: fromId,
        to_id: toId,
        obj_id: objId,
        content: content || '',
        obj_type: objType,
        action_type: actionType,
        private: false, // Default to false based on old code
        post_at: postAt,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getNewInboxCount(userId: bigint, type: string) {
    const typeInt = parseInt(type, 10);
    return this.prisma.inboxes.count({
      where: {
        to_id: userId,
        action_type: typeInt,
        read_at: null,
      },
    });
  }

  async getUserInbox(userId: bigint, type: string, messageType: string, pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;
    const typeInt = parseInt(type, 10);
    // messageType might be used for filtering, but typically action_type suffices in legacy

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

    // Mark as read
    const unreadIds = inboxes.filter(i => !i.read_at).map(i => i.id);
    if (unreadIds.length > 0) {
      await this.prisma.inboxes.updateMany({
        where: { id: { in: unreadIds } },
        data: { read_at: new Date() },
      });
    }

    // Populate from user details
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
}