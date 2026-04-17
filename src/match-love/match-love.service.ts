import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchLoveService {
  constructor(private readonly prisma: PrismaService) {}

  async createMatchLove(
    ownerId: bigint,
    collegeId: bigint,
    userName: string,
    matchName: string,
    content: string,
    attachments: string,
    isPrivate: number,
  ) {
    if (!userName || !matchName) {
      throw new HttpException('名字不能为空', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.match_loves.create({
      data: {
        owner_id: ownerId,
        college_id: collegeId || null,
        user_name: userName,
        match_name: matchName,
        content: content || '',
        attachments: attachments || '',
        private: isPrivate || 1,
        is_password: 0,
        type: 1,
        status: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async getMatchLovesList(
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
    // ... Implement similar to sale-friend ...
    // But since the schema has no "users" relation on match_loves initially (we would need to add it), 
    // let's return a simple mock for now until schema is updated for match_loves.
    
    return {
      page_data: [],
      total: 0,
      page: pageNumber,
      pageSize,
      last_page: 1,
    };
  }
}
