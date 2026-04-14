import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PraiseService {
  constructor(private readonly prisma: PrismaService) {}

  async createPraise(userId: bigint, objId: bigint, objType: number) {
    // Check if user already praised this object
    const existing = await this.prisma.praises.findFirst({
      where: {
        owner_id: userId,
        obj_id: objId,
        obj_type: objType,
      },
    });

    if (existing) {
      return existing; // Already praised, return early
    }

    // 1: Post, 2: SaleFriend (MatchLove in older version), etc.
    const praise = await this.prisma.praises.create({
      data: {
        owner_id: userId,
        obj_id: objId,
        obj_type: objType,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Increment praise count based on object type
    if (objType === 1) {
      await this.prisma.posts.update({
        where: { id: objId },
        data: { praise_number: { increment: 1 } },
      });
    } else if (objType === 2) {
      await this.prisma.sale_friends.update({
        where: { id: objId },
        data: { praise_number: { increment: 1 } },
      });
    } else if (objType === 3) {
      await this.prisma.match_loves.update({
        where: { id: objId },
        data: { praise_number: { increment: 1 } },
      });
    }

    // Optional: We can add inbox notification logic here later if needed

    return praise;
  }
}