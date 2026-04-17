import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JobService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(
    userId: bigint,
    title: string,
    content: string,
    attachments: string,
    salary: number,
    endAt: string,
  ) {
    if (!title || !content) {
      throw new HttpException('标题和内容不能为空', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.part_time_jobs.create({
      data: {
        user_id: userId,
        title,
        content,
        attachments: attachments || '',
        salary: salary || 0,
        end_at: endAt ? new Date(endAt) : new Date(),
        status: 1, // RECRUITING
        type: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async applyJob(userId: bigint, jobId: bigint) {
    const job = await this.prisma.part_time_jobs.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      throw new HttpException('悬赏不存在', HttpStatus.NOT_FOUND);
    }
    if (job.user_id === userId) {
      throw new HttpException('不能接自己的悬赏令', HttpStatus.BAD_REQUEST);
    }
    if (job.status !== 1) {
      throw new HttpException('该悬赏令不处于招募中', HttpStatus.BAD_REQUEST);
    }

    const existing = await this.prisma.employee_part_time_jobs.findFirst({
      where: { user_id: userId, part_time_job_id: jobId },
    });

    if (existing) {
      throw new HttpException('您已接过该悬赏令，不能重复接单', HttpStatus.BAD_REQUEST);
    }

    // Assign job within a transaction
    await this.prisma.$transaction(async (tx) => {
      await tx.employee_part_time_jobs.create({
        data: {
          user_id: userId,
          part_time_job_id: jobId,
          status: 2, // WORKING
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      await tx.part_time_jobs.update({
        where: { id: jobId },
        data: { status: 2, updated_at: new Date() },
      });
    });

    return 1;
  }

  async getJobList(pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;

    const items = await this.prisma.part_time_jobs.findMany({
      where: { status: 1 },
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        users: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    const total = await this.prisma.part_time_jobs.count({ where: { status: 1 } });

    const formatted = items.map(item => ({
      ...item,
      users: undefined,
      boss: item.users,
      attachments: item.attachments ? item.attachments.split(',') : [],
    }));

    return {
      page_data: formatted,
      total,
      page: pageNumber,
      pageSize,
      last_page: Math.ceil(total / pageSize),
    };
  }

  async getJobDetail(jobId: bigint) {
    const item = await this.prisma.part_time_jobs.findUnique({
      where: { id: jobId },
      include: {
        users: { select: { id: true, nickname: true, avatar: true } },
      },
    });

    if (!item) {
      throw new HttpException('记录不存在', HttpStatus.NOT_FOUND);
    }

    return {
      ...item,
      users: undefined,
      boss: item.users,
      attachments: item.attachments ? item.attachments.split(',') : [],
    };
  }
}
