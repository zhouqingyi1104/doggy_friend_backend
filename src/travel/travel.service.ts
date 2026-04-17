import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TravelService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatisticStep(userId: bigint) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayStepRecord = await this.prisma.run_steps.findFirst({
      where: {
        user_id: userId,
        run_at: { gte: today },
      },
    });

    const totalStepResult = await this.prisma.run_steps.aggregate({
      where: { user_id: userId },
      _sum: { step: true },
    });

    const sumStep = Number(totalStepResult._sum.step || 0);

    return {
      today_step: Number(todayStepRecord?.step || 0),
      total_step: Math.round(sumStep / 10000 * 10) / 10,
    };
  }

  async getMyRank(userId: bigint) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const myStep = await this.prisma.run_steps.findFirst({
      where: { user_id: userId, run_at: { gte: today } },
    });

    if (!myStep) return { rank: 0 };

    const rankCount = await this.prisma.run_steps.count({
      where: {
        run_at: { gte: today },
        step: { gt: myStep.step },
      },
    });

    return { rank: rankCount + 1 };
  }

  async saveStep(userId: bigint, encryptedData: string, iv: string, code: string) {
    // WeChat step decryption normally happens here.
    // As a mock, we will add random steps to the user today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const mockSteps = Math.floor(Math.random() * 5000) + 1000;

    const existing = await this.prisma.run_steps.findFirst({
      where: { user_id: userId, run_at: { gte: today } },
    });

    if (existing) {
      await this.prisma.run_steps.update({
        where: { id: existing.id },
        data: { step: Number(existing.step) + mockSteps, updated_at: new Date() },
      });
    } else {
      await this.prisma.run_steps.create({
        data: {
          user_id: userId,
          step: mockSteps,
          type: 1,
          run_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }
    return { status: 'ok', msg: 'Steps synced successfully' };
  }

  async getSteps(userId: bigint, pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;
    const items = await this.prisma.run_steps.findMany({
      where: { user_id: userId },
      skip,
      take: pageSize,
      orderBy: { run_at: 'desc' },
    });
    const total = await this.prisma.run_steps.count({ where: { user_id: userId } });

    return {
      page_data: items,
      total,
      page: pageNumber,
      pageSize,
      last_page: Math.ceil(total / pageSize),
    };
  }
}
