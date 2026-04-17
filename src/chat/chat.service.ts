import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InboxService } from '../inbox/inbox.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly inboxService: InboxService,
  ) {}

  async sendMessage(
    userId: bigint,
    friendId: bigint,
    content: string,
    attachments: string,
  ) {
    if (!content && !attachments) {
      throw new HttpException('消息内容不能为空', HttpStatus.BAD_REQUEST);
    }

    const postAt = new Date();
    const displayContent = content ? content : '收到一张图片';

    // Wrap in a transaction
    const message = await this.prisma.$transaction(async (tx) => {
      // Check or create friend relationship
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

      // Create chat message
      const newMsg = await tx.chat_messages.create({
        data: {
          from_user_id: userId,
          to_user_id: friendId,
          content: content || '',
          attachments: attachments || '',
          type: 1, // ENUM_STATUS_RED
          status: 1,
          post_at: postAt,
          created_at: postAt,
          updated_at: postAt,
        },
      });

      // Send to inbox directly via tx to ensure atomicity
      await tx.inboxes.create({
        data: {
          from_id: userId,
          to_id: friendId,
          obj_id: friendId,
          content: displayContent,
          obj_type: 4, // ENUM_OBJ_TYPE_CHAT
          action_type: 2, // ENUM_ACTION_TYPE_CHAT
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

  async getChatList(userId: bigint, friendId: bigint, pageSize: number = 10, pageNumber: number = 1) {
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

    // Mark as read
    const unreadIds = messages.filter(m => !m.read_at && m.to_user_id === userId).map(m => m.id);
    if (unreadIds.length > 0) {
      await this.prisma.chat_messages.updateMany({
        where: { id: { in: unreadIds } },
        data: { read_at: new Date() },
      });
    }

    // Format messages
    const formatted = messages.map(m => {
      return {
        ...m,
        attachments: m.attachments ? m.attachments.split(',') : [],
      };
    });

    // Reverse to get chronological order for chat view
    return {
      page_data: formatted.reverse(),
      total,
      page: pageNumber,
      pageSize,
      last_page: Math.ceil(total / pageSize),
    };
  }

  async getNewMessages(userId: bigint, friendId: bigint) {
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

  async getNewLetterCount(userId: bigint) {
    return this.prisma.chat_messages.count({
      where: {
        to_user_id: userId,
        read_at: null,
      },
    });
  }

  async getFriends(userId: bigint) {
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

    // Attach unread counts
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

  async deleteMessage(userId: bigint, messageId: bigint) {
    // Basic ownership check
    const message = await this.prisma.chat_messages.findUnique({
      where: { id: messageId },
    });

    if (!message || message.from_user_id !== userId) {
      throw new HttpException('无权删除此消息', HttpStatus.FORBIDDEN);
    }

    await this.prisma.chat_messages.delete({
      where: { id: messageId },
    });

    return 1;
  }
}