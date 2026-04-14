import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prisma: PrismaService) {}

  async toggleFollow(userId: bigint, objId: bigint, objType: number) {
    const existing = await this.prisma.follows.findFirst({
      where: {
        user_id: userId,
        obj_id: objId,
        obj_type: objType,
      },
    });

    if (existing) {
      // Toggle status
      const newStatus = existing.status === 1 ? 0 : 1;
      await this.prisma.follows.update({
        where: { id: existing.id },
        data: {
          status: newStatus,
          updated_at: new Date(),
        },
      });

      // Update follow/fans count
      if (objType === 1) { // Follow user
        await this.prisma.users.update({
          where: { id: userId },
          data: { follow_num: { increment: newStatus === 1 ? 1 : -1 } },
        });
        await this.prisma.users.update({
          where: { id: objId },
          data: { fans_num: { increment: newStatus === 1 ? 1 : -1 } },
        });
      }

      return { status: newStatus };
    } else {
      // Create follow
      await this.prisma.follows.create({
        data: {
          user_id: userId,
          obj_id: objId,
          obj_type: objType,
          status: 1,
          follow_nickname: '',
          follow_avatar: '',
          be_follow_nickname: '',
          be_follow_avatar: '',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Update follow/fans count
      if (objType === 1) {
        await this.prisma.users.update({
          where: { id: userId },
          data: { follow_num: { increment: 1 } },
        });
        await this.prisma.users.update({
          where: { id: objId },
          data: { fans_num: { increment: 1 } },
        });
      }

      return { status: 1 };
    }
  }

  async checkFollow(userId: bigint, objId: bigint, objType: number) {
    const follow = await this.prisma.follows.findFirst({
      where: {
        user_id: userId,
        obj_id: objId,
        obj_type: objType,
      },
    });

    return { has_follow: follow ? follow.status === 1 : false };
  }
}