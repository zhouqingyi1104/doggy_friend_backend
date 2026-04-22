import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWallet(userId: number) {
    let wallet = await this.prisma.wallets.findUnique({
      where: { user_id: BigInt(userId) },
    });

    if (!wallet) {
      wallet = await this.prisma.wallets.create({
        data: {
          user_id: BigInt(userId),
          balance: 0.00,
          frozen_balance: 0.00,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
    }

    return {
      user_id: wallet.user_id.toString(),
      balance: Number(wallet.balance),
      frozen_balance: Number(wallet.frozen_balance),
    };
  }

  async recharge(userId: number, amount: number) {
    if (amount <= 0) {
      throw new HttpException('充值金额必须大于0', HttpStatus.BAD_REQUEST);
    }

    // Ensure wallet exists
    await this.getWallet(userId);

    const updated = await this.prisma.wallets.update({
      where: { user_id: BigInt(userId) },
      data: {
        balance: {
          increment: amount,
        },
        updated_at: new Date(),
      },
    });

    return {
      user_id: updated.user_id.toString(),
      balance: Number(updated.balance),
      message: '充值成功',
    };
  }

  async withdraw(userId: number, amount: number) {
    if (amount <= 0) {
      throw new HttpException('提现金额必须大于0', HttpStatus.BAD_REQUEST);
    }

    return this.prisma.$transaction(async (tx) => {
      const wallet = await tx.wallets.findUnique({
        where: { user_id: BigInt(userId) },
      });

      if (!wallet || Number(wallet.balance) < amount) {
        throw new HttpException('余额不足', HttpStatus.BAD_REQUEST);
      }

      const updated = await tx.wallets.update({
        where: { user_id: BigInt(userId) },
        data: {
          balance: {
            decrement: amount,
          },
          updated_at: new Date(),
        },
      });

      // Mock WeChat withdrawal logic here

      return {
        user_id: updated.user_id.toString(),
        balance: Number(updated.balance),
        message: '提现申请已提交',
      };
    });
  }
}
