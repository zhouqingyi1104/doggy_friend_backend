import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { CreateGoodsDto } from './dto/create-goods.dto';

@Injectable()
export class GoodsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
  ) {}

  async publish(appId: number, sellerId: number, dto: CreateGoodsDto) {
    // 1. Validate sensitive words
    await this.utilsService.checkText(appId, dto.title + ' ' + (dto.description || ''));

    // 2. Create goods
    const goods = await this.prisma.goods.create({
      data: {
        seller_id: BigInt(sellerId),
        title: dto.title,
        description: dto.description || '',
        category: dto.category || 'other',
        price: dto.price,
        stock: dto.stock,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return {
      goods_id: goods.id.toString(),
      message: '商品发布成功',
    };
  }

  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.page_size) || 10;
    const category = query.category;

    const where: any = { deleted_at: null, stock: { gt: 0 } };
    if (category) {
      where.category = category;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.goods.count({ where }),
      this.prisma.goods.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          seller: {
            select: { id: true, nickname: true, avatar: true, credit_score: true },
          },
        },
      }),
    ]);

    const formattedData = data.map(item => ({
      ...item,
      id: item.id.toString(),
      seller_id: item.seller_id.toString(),
      price: Number(item.price),
      seller: { ...item.seller, id: item.seller.id.toString() },
    }));

    return { total, page, page_size: pageSize, page_data: formattedData };
  }

  async findOne(id: string) {
    const goods = await this.prisma.goods.findUnique({
      where: { id: BigInt(id) },
      include: {
        seller: {
          select: { id: true, nickname: true, avatar: true, credit_score: true },
        },
      },
    });

    if (!goods || goods.deleted_at) {
      throw new HttpException('商品不存在或已下架', HttpStatus.NOT_FOUND);
    }

    return {
      ...goods,
      id: goods.id.toString(),
      seller_id: goods.seller_id.toString(),
      price: Number(goods.price),
      seller: { ...goods.seller, id: goods.seller.id.toString() },
    };
  }

  async buy(buyerId: number, goodsId: string, quantity: number) {
    return this.prisma.$transaction(async (tx) => {
      const goods = await tx.goods.findUnique({ where: { id: BigInt(goodsId) } });
      
      if (!goods || goods.deleted_at) {
        throw new HttpException('商品不存在或已下架', HttpStatus.NOT_FOUND);
      }
      if (goods.stock < quantity) {
        throw new HttpException('库存不足', HttpStatus.BAD_REQUEST);
      }
      if (goods.seller_id === BigInt(buyerId)) {
        throw new HttpException('不能购买自己的商品', HttpStatus.BAD_REQUEST);
      }

      const totalAmount = Number(goods.price) * quantity;

      // PRD 3.2.7: 支付流程与钱包扣款
      const buyerWallet = await tx.wallets.findUnique({ where: { user_id: BigInt(buyerId) } });
      if (!buyerWallet || Number(buyerWallet.balance) < totalAmount) {
        throw new HttpException('钱包余额不足，请先充值', HttpStatus.BAD_REQUEST);
      }

      // Deduct buyer balance
      await tx.wallets.update({
        where: { user_id: BigInt(buyerId) },
        data: { balance: { decrement: totalAmount }, updated_at: new Date() },
      });

      // Add to seller balance (immediately, since it's a simple second-hand platform transfer)
      // or we can hold it until confirmed, but PRD doesn't strictly specify deposit logic for Goods. 
      // We will add it to seller directly.
      await tx.wallets.update({
        where: { user_id: goods.seller_id as bigint },
        data: { balance: { increment: totalAmount }, updated_at: new Date() },
      });

      // Decrement stock
      await tx.goods.update({
        where: { id: BigInt(goodsId) },
        data: { stock: { decrement: quantity }, updated_at: new Date() },
      });

      // Create order
      const order = await tx.goods_orders.create({
        data: {
          goods_id: BigInt(goodsId),
          buyer_id: BigInt(buyerId),
          quantity,
          amount: totalAmount,
          status: 1, // 1 = 已支付
          pay_time: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return {
        order_id: order.id.toString(),
        message: '购买成功',
      };
    });
  }
}
