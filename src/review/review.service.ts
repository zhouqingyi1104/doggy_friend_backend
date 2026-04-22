import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  async createReview(appId: number, reviewerId: number, dto: CreateReviewDto) {
    if (dto.comment) {
      await this.utilsService.checkText(appId, dto.comment);
    }

    return this.prisma.$transaction(async (tx) => {
      let revieweeId: bigint;
      
      // Determine reviewee based on order type
      if (dto.order_type === 1) {
        // Task Order
        const order = await tx.orders.findUnique({
          where: { id: BigInt(dto.order_id) },
          include: { task: true }
        });

        if (!order || order.status !== 2) {
          throw new HttpException('任务订单不存在或未完成', HttpStatus.BAD_REQUEST);
        }

        // Both buyer and seller can review each other
        if (order.task.buyer_id === BigInt(reviewerId)) {
          revieweeId = order.task.seller_id as bigint;
        } else if (order.task.seller_id === BigInt(reviewerId)) {
          revieweeId = order.task.buyer_id;
        } else {
          throw new HttpException('无权评价此订单', HttpStatus.FORBIDDEN);
        }
      } else if (dto.order_type === 2) {
        // Goods Order
        const order = await tx.goods_orders.findUnique({
          where: { id: BigInt(dto.order_id) },
          include: { goods: true }
        });

        if (!order) {
          throw new HttpException('商品订单不存在', HttpStatus.BAD_REQUEST);
        }

        if (order.buyer_id === BigInt(reviewerId)) {
          revieweeId = order.goods.seller_id;
        } else if (order.goods.seller_id === BigInt(reviewerId)) {
          revieweeId = order.buyer_id;
        } else {
          throw new HttpException('无权评价此订单', HttpStatus.FORBIDDEN);
        }
      } else {
        throw new HttpException('无效的订单类型', HttpStatus.BAD_REQUEST);
      }

      // Check if already reviewed
      const existingReview = await tx.reviews.findFirst({
        where: {
          order_id: BigInt(dto.order_id),
          reviewer_id: BigInt(reviewerId),
        },
      });

      if (existingReview) {
        throw new HttpException('您已经评价过该订单了', HttpStatus.BAD_REQUEST);
      }

      // Create Review
      const review = await tx.reviews.create({
        data: {
          order_id: BigInt(dto.order_id),
          reviewer_id: BigInt(reviewerId),
          reviewee_id: revieweeId,
          rating: dto.rating,
          comment: dto.comment || '',
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Update User Credit Score (PRD 6.3)
      // Every review: +2 for good (4-5 stars), -5 for bad (1-2 stars)
      let creditChange = 0;
      if (dto.rating >= 4) {
        creditChange = 2;
      } else if (dto.rating <= 2) {
        creditChange = -5;
      }

      if (creditChange !== 0) {
        const user = await tx.users.findUnique({ where: { id: revieweeId } });
        if (user) {
          let newCredit = user.credit_score + creditChange;
          if (newCredit < 0) newCredit = 0;

          // Optional: level up logic (e.g. +1 star per 100 points, starting from 100=1)
          let newLevel = user.level;
          if (newCredit >= 200 && user.level < 5) {
             newLevel = Math.min(5, Math.floor(newCredit / 100)); // simple example
          }

          await tx.users.update({
            where: { id: revieweeId },
            data: {
              credit_score: newCredit,
              level: newLevel,
              updated_at: new Date(),
            },
          });
        }
      }

      return {
        review_id: review.id.toString(),
        message: '评价成功',
      };
    });
  }
}
