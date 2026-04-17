import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CompareFaceService {
  constructor(private readonly prisma: PrismaService) {}

  async compareFace(userId: bigint, yourFace: string, hisFace: string) {
    // In legacy, this calls Baidu/Tencent AI. We will mock the AI comparison logic
    // but save the record to the database properly.
    const mockScore = Math.floor(Math.random() * 40) + 50; // Random score between 50 and 90

    const record = await this.prisma.compare_faces.create({
      data: {
        user_id: userId,
        attachments: `${yourFace},${hisFace}`,
        confidence: mockScore,
        status: 1, // SUCCESS
        compare_result: JSON.stringify({ score: mockScore, msg: 'Mocked AI result' }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      id: record.id,
      score: mockScore,
      msg: mockScore > 80 ? '天生一对' : '还需努力',
    };
  }

  async getAnimeFace(userId: bigint, image: string) {
    // Mock anime face generation since it requires Baidu/Tencent API keys
    return image; // Just return the same image as a fallback
  }
}
