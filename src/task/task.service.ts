import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UtilsService } from '../utils/utils.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilsService: UtilsService,
    private readonly walletService: WalletService,
  ) {}

  async create(appId: number, userId: number, dto: CreateTaskDto) {
    // 1. Validate text (WeChat msg_sec_check + Local sensitive words)
    await this.utilsService.checkText(appId, dto.title + ' ' + dto.description);

    return this.prisma.$transaction(async (tx) => {
      // 2. Ensure user has enough balance to pay full price upfront (price + deposit are held)
      // PRD 3.2.6: 买家发布任务时需先支付全额（系统冻结部分作为担保金）
      // For simplicity, let's assume buyer pays `price`. Seller freezes `deposit`.
      const buyerWallet = await tx.wallets.findUnique({
        where: { user_id: BigInt(userId) },
      });

      if (!buyerWallet || Number(buyerWallet.balance) < dto.price) {
        throw new HttpException('钱包余额不足，请先充值', HttpStatus.BAD_REQUEST);
      }

      // Deduct from buyer balance
      await tx.wallets.update({
        where: { user_id: BigInt(userId) },
        data: {
          balance: { decrement: dto.price },
          updated_at: new Date(),
        },
      });

      // 3. Create Task
      const task = await tx.tasks.create({
        data: {
          buyer_id: BigInt(userId),
          type: dto.type,
          title: dto.title,
          description: dto.description,
          location: dto.location || '',
          time_range: dto.time_range || '',
          price: dto.price,
          deposit: dto.deposit || 0.0,
          min_credit: dto.min_credit || 0,
          status: 1, // 1 = 待接单
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // 4. Create Order
      await tx.orders.create({
        data: {
          task_id: task.id,
          amount: dto.price,
          status: 1, // 1 = 已支付
          pay_time: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      return {
        task_id: task.id.toString(),
        message: '任务发布成功，已扣除费用',
      };
    });
  }

  async findAll(query: any) {
    const page = parseInt(query.page) || 1;
    const pageSize = parseInt(query.page_size) || 10;
    const type = query.type ? parseInt(query.type) : undefined;
    const status = query.status ? parseInt(query.status) : 1;

    const where: any = { status };
    if (type) {
      where.type = type;
    }

    const [total, data] = await this.prisma.$transaction([
      this.prisma.tasks.count({ where }),
      this.prisma.tasks.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: 'desc' },
        include: {
          buyer: {
            select: {
              id: true,
              nickname: true,
              avatar: true,
              level: true,
              credit_score: true,
            },
          },
        },
      }),
    ]);

    // Format BigInt
    const formattedData = data.map(item => ({
      ...item,
      id: item.id.toString(),
      buyer_id: item.buyer_id.toString(),
      seller_id: item.seller_id?.toString() || null,
      price: Number(item.price),
      deposit: Number(item.deposit),
      buyer: {
        ...item.buyer,
        id: item.buyer.id.toString(),
      }
    }));

    return {
      total,
      page,
      page_size: pageSize,
      page_data: formattedData,
    };
  }

  async findMyPublished(userId: bigint, pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;

    const items = await this.prisma.tasks.findMany({
      where: { buyer_id: userId },
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        buyer: { select: { id: true, nickname: true, avatar: true, credit_score: true } },
        seller: { select: { id: true, nickname: true, avatar: true, credit_score: true } }
      },
    });

    const total = await this.prisma.tasks.count({ where: { buyer_id: userId } });

    const formatted = items.map(item => ({
      ...item,
      id: item.id.toString(),
      buyer_id: item.buyer_id.toString(),
      seller_id: item.seller_id?.toString() || null,
      price: Number(item.price),
      deposit: Number(item.deposit),
      buyer: { ...item.buyer, id: item.buyer.id.toString() },
      seller: item.seller ? { ...item.seller, id: item.seller.id.toString() } : null,
    }));

    return {
      page_data: formatted,
      total,
      page: pageNumber,
      pageSize,
      last_page: Math.ceil(total / pageSize),
    };
  }

  async findMyAccepted(userId: bigint, pageSize: number = 10, pageNumber: number = 1) {
    const skip = (pageNumber - 1) * pageSize;

    const items = await this.prisma.tasks.findMany({
      where: { seller_id: userId },
      skip,
      take: pageSize,
      orderBy: { created_at: 'desc' },
      include: {
        buyer: { select: { id: true, nickname: true, avatar: true, credit_score: true } },
        seller: { select: { id: true, nickname: true, avatar: true, credit_score: true } }
      },
    });

    const total = await this.prisma.tasks.count({ where: { seller_id: userId } });

    const formatted = items.map(item => ({
      ...item,
      id: item.id.toString(),
      buyer_id: item.buyer_id.toString(),
      seller_id: item.seller_id?.toString() || null,
      price: Number(item.price),
      deposit: Number(item.deposit),
      buyer: { ...item.buyer, id: item.buyer.id.toString() },
      seller: item.seller ? { ...item.seller, id: item.seller.id.toString() } : null,
    }));

    return {
      page_data: formatted,
      total,
      page: pageNumber,
      pageSize,
      last_page: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.tasks.findUnique({
      where: { id: BigInt(id) },
      include: {
        buyer: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            level: true,
            credit_score: true,
          },
        },
        seller: {
          select: {
            id: true,
            nickname: true,
            avatar: true,
            level: true,
            credit_score: true,
          },
        },
      },
    });

    if (!task) {
      throw new HttpException('任务不存在', HttpStatus.NOT_FOUND);
    }

    return {
      ...task,
      id: task.id.toString(),
      buyer_id: task.buyer_id.toString(),
      seller_id: task.seller_id?.toString() || null,
      price: Number(task.price),
      deposit: Number(task.deposit),
      buyer: {
        ...task.buyer,
        id: task.buyer.id.toString(),
      },
      seller: task.seller ? {
        ...task.seller,
        id: task.seller.id.toString(),
      } : null,
    };
  }

  async accept(userId: number, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.tasks.findUnique({
        where: { id: BigInt(id) },
      });

      if (!task) {
        throw new HttpException('任务不存在', HttpStatus.NOT_FOUND);
      }

      if (task.status !== 1) {
        throw new HttpException('任务已被接取或已取消', HttpStatus.BAD_REQUEST);
      }

      if (task.buyer_id === BigInt(userId)) {
        throw new HttpException('不能接取自己发布的任务', HttpStatus.BAD_REQUEST);
      }

      // check min credit
      const user = await tx.users.findUnique({
        where: { id: BigInt(userId) },
      });

      if (!user) {
        throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
      }

      if (user.credit_score < task.min_credit) {
        throw new HttpException(`信誉分不足，任务要求最低信誉分：${task.min_credit}`, HttpStatus.BAD_REQUEST);
      }

      const depositNum = Number(task.deposit);
      if (depositNum > 0) {
        // Freeze seller's deposit in wallet
        const sellerWallet = await tx.wallets.findUnique({
          where: { user_id: BigInt(userId) },
        });

        if (!sellerWallet || Number(sellerWallet.balance) < depositNum) {
          throw new HttpException('钱包余额不足以支付担保金，请先充值', HttpStatus.BAD_REQUEST);
        }

        await tx.wallets.update({
          where: { user_id: BigInt(userId) },
          data: {
            balance: { decrement: depositNum },
            frozen_balance: { increment: depositNum },
            updated_at: new Date(),
          },
        });
      }

      const updated = await tx.tasks.update({
        where: { id: BigInt(id) },
        data: {
          status: 2, // 2 = 进行中
          seller_id: BigInt(userId),
          updated_at: new Date(),
        },
      });

      return { message: '接单成功' };
    });
  }

  async complete(userId: number, id: string) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.tasks.findUnique({
        where: { id: BigInt(id) },
      });

      if (!task) {
        throw new HttpException('任务不存在', HttpStatus.NOT_FOUND);
      }

      if (task.status !== 2) {
        throw new HttpException('任务状态不正确', HttpStatus.BAD_REQUEST);
      }

      if (task.seller_id !== BigInt(userId)) {
        throw new HttpException('只有接单人可以完成任务', HttpStatus.FORBIDDEN);
      }

      // 3 = 已完成
      await tx.tasks.update({
        where: { id: BigInt(id) },
        data: {
          status: 3,
          updated_at: new Date(),
        },
      });

      // Update Order status
      await tx.orders.update({
        where: { task_id: BigInt(id) },
        data: {
          status: 2, // 2 = 完成
          updated_at: new Date(),
        },
      });

      // Release frozen deposit and add task price to seller earnings
      const depositNum = Number(task.deposit);
      const priceNum = Number(task.price);
      
      // Calculate earnings (minus 5% commission for platform)
      const commission = priceNum * 0.05;
      const finalEarnings = priceNum - commission;

      await tx.wallets.update({
        where: { user_id: BigInt(userId) },
        data: {
          balance: { increment: depositNum + finalEarnings },
          frozen_balance: { decrement: depositNum },
          updated_at: new Date(),
        },
      });

      return { message: '任务已标记为完成，收益已到账' };
    });
  }

  async cancel(userId: number, id: string, reason: string) {
    return this.prisma.$transaction(async (tx) => {
      const task = await tx.tasks.findUnique({
        where: { id: BigInt(id) },
      });

      if (!task) {
        throw new HttpException('任务不存在', HttpStatus.NOT_FOUND);
      }

      if (task.status === 3 || task.status === 4) {
        throw new HttpException('任务已结束，无法取消', HttpStatus.BAD_REQUEST);
      }

      // check if it's buyer or seller
      const isBuyer = task.buyer_id === BigInt(userId);
      const isSeller = task.seller_id === BigInt(userId);

      if (!isBuyer && !isSeller) {
        throw new HttpException('无权取消该任务', HttpStatus.FORBIDDEN);
      }

      // 4 = 已取消
      await tx.tasks.update({
        where: { id: BigInt(id) },
        data: {
          status: 4,
          updated_at: new Date(),
        },
      });

      // Handle refunds
      const priceNum = Number(task.price);
      const depositNum = Number(task.deposit);

      if (task.status === 1) {
        // Buyer cancels before anyone accepts. Full refund of price to buyer.
        await tx.wallets.update({
          where: { user_id: task.buyer_id },
          data: {
            balance: { increment: priceNum },
            updated_at: new Date(),
          },
        });
      } else if (task.status === 2) {
        // Canceled while in progress.
        // PRD Penalty Logic: 10% of deposit as penalty.
        // In reality, this requires checking the deadline, but we simplify here.
        let penalty = 0;
        if (depositNum > 0) {
          penalty = depositNum * 0.1;
        }

        if (isSeller) {
          // Seller canceled: Buyer gets full refund + penalty from seller deposit.
          // Seller gets their deposit back minus penalty.
          await tx.wallets.update({
            where: { user_id: task.buyer_id },
            data: { balance: { increment: priceNum + penalty } },
          });

          await tx.wallets.update({
            where: { user_id: task.seller_id as bigint },
            data: {
              balance: { increment: depositNum - penalty },
              frozen_balance: { decrement: depositNum },
            },
          });
        } else if (isBuyer) {
          // Buyer canceled: Seller gets deposit back + penalty from buyer's price.
          // Buyer gets refund minus penalty.
          let buyerRefund = priceNum;
          let sellerCompensation = 0;
          if (priceNum >= penalty) {
             buyerRefund -= penalty;
             sellerCompensation += penalty;
          }

          await tx.wallets.update({
            where: { user_id: task.buyer_id },
            data: { balance: { increment: buyerRefund } },
          });

          await tx.wallets.update({
            where: { user_id: task.seller_id as bigint },
            data: {
              balance: { increment: depositNum + sellerCompensation },
              frozen_balance: { decrement: depositNum },
            },
          });
        }
      }

      await tx.orders.update({
        where: { task_id: BigInt(id) },
        data: {
          status: 3, // 3 = 退款
          updated_at: new Date(),
        },
      });

      return { message: '任务已取消，退款/违约金已处理' };
    });
  }
}