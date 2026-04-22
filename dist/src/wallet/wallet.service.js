"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WalletService = class WalletService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWallet(userId) {
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
    async recharge(userId, amount) {
        if (amount <= 0) {
            throw new common_1.HttpException('充值金额必须大于0', common_1.HttpStatus.BAD_REQUEST);
        }
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
    async withdraw(userId, amount) {
        if (amount <= 0) {
            throw new common_1.HttpException('提现金额必须大于0', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.$transaction(async (tx) => {
            const wallet = await tx.wallets.findUnique({
                where: { user_id: BigInt(userId) },
            });
            if (!wallet || Number(wallet.balance) < amount) {
                throw new common_1.HttpException('余额不足', common_1.HttpStatus.BAD_REQUEST);
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
            return {
                user_id: updated.user_id.toString(),
                balance: Number(updated.balance),
                message: '提现申请已提交',
            };
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WalletService);
//# sourceMappingURL=wallet.service.js.map