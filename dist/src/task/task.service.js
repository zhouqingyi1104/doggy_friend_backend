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
exports.TaskService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_service_1 = require("../utils/utils.service");
const wallet_service_1 = require("../wallet/wallet.service");
let TaskService = class TaskService {
    prisma;
    utilsService;
    walletService;
    constructor(prisma, utilsService, walletService) {
        this.prisma = prisma;
        this.utilsService = utilsService;
        this.walletService = walletService;
    }
    async create(appId, userId, dto) {
        await this.utilsService.checkText(appId, dto.title + ' ' + dto.description);
        return this.prisma.$transaction(async (tx) => {
            const buyerWallet = await tx.wallets.findUnique({
                where: { user_id: BigInt(userId) },
            });
            if (!buyerWallet || Number(buyerWallet.balance) < dto.price) {
                throw new common_1.HttpException('钱包余额不足，请先充值', common_1.HttpStatus.BAD_REQUEST);
            }
            await tx.wallets.update({
                where: { user_id: BigInt(userId) },
                data: {
                    balance: { decrement: dto.price },
                    updated_at: new Date(),
                },
            });
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
                    status: 1,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            await tx.orders.create({
                data: {
                    task_id: task.id,
                    amount: dto.price,
                    status: 1,
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
    async findAll(query) {
        const page = parseInt(query.page) || 1;
        const pageSize = parseInt(query.page_size) || 10;
        const type = query.type ? parseInt(query.type) : undefined;
        const status = query.status ? parseInt(query.status) : 1;
        const where = { status };
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
    async findMyPublished(userId, pageSize = 10, pageNumber = 1) {
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
    async findMyAccepted(userId, pageSize = 10, pageNumber = 1) {
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
    async findOne(id) {
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
            throw new common_1.HttpException('任务不存在', common_1.HttpStatus.NOT_FOUND);
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
    async accept(userId, id) {
        return this.prisma.$transaction(async (tx) => {
            const task = await tx.tasks.findUnique({
                where: { id: BigInt(id) },
            });
            if (!task) {
                throw new common_1.HttpException('任务不存在', common_1.HttpStatus.NOT_FOUND);
            }
            if (task.status !== 1) {
                throw new common_1.HttpException('任务已被接取或已取消', common_1.HttpStatus.BAD_REQUEST);
            }
            if (task.buyer_id === BigInt(userId)) {
                throw new common_1.HttpException('不能接取自己发布的任务', common_1.HttpStatus.BAD_REQUEST);
            }
            const user = await tx.users.findUnique({
                where: { id: BigInt(userId) },
            });
            if (!user) {
                throw new common_1.HttpException('用户不存在', common_1.HttpStatus.NOT_FOUND);
            }
            if (user.credit_score < task.min_credit) {
                throw new common_1.HttpException(`信誉分不足，任务要求最低信誉分：${task.min_credit}`, common_1.HttpStatus.BAD_REQUEST);
            }
            const depositNum = Number(task.deposit);
            if (depositNum > 0) {
                const sellerWallet = await tx.wallets.findUnique({
                    where: { user_id: BigInt(userId) },
                });
                if (!sellerWallet || Number(sellerWallet.balance) < depositNum) {
                    throw new common_1.HttpException('钱包余额不足以支付担保金，请先充值', common_1.HttpStatus.BAD_REQUEST);
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
                    status: 2,
                    seller_id: BigInt(userId),
                    updated_at: new Date(),
                },
            });
            return { message: '接单成功' };
        });
    }
    async complete(userId, id) {
        return this.prisma.$transaction(async (tx) => {
            const task = await tx.tasks.findUnique({
                where: { id: BigInt(id) },
            });
            if (!task) {
                throw new common_1.HttpException('任务不存在', common_1.HttpStatus.NOT_FOUND);
            }
            if (task.status !== 2) {
                throw new common_1.HttpException('任务状态不正确', common_1.HttpStatus.BAD_REQUEST);
            }
            if (task.seller_id !== BigInt(userId)) {
                throw new common_1.HttpException('只有接单人可以完成任务', common_1.HttpStatus.FORBIDDEN);
            }
            await tx.tasks.update({
                where: { id: BigInt(id) },
                data: {
                    status: 3,
                    updated_at: new Date(),
                },
            });
            await tx.orders.update({
                where: { task_id: BigInt(id) },
                data: {
                    status: 2,
                    updated_at: new Date(),
                },
            });
            const depositNum = Number(task.deposit);
            const priceNum = Number(task.price);
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
    async cancel(userId, id, reason) {
        return this.prisma.$transaction(async (tx) => {
            const task = await tx.tasks.findUnique({
                where: { id: BigInt(id) },
            });
            if (!task) {
                throw new common_1.HttpException('任务不存在', common_1.HttpStatus.NOT_FOUND);
            }
            if (task.status === 3 || task.status === 4) {
                throw new common_1.HttpException('任务已结束，无法取消', common_1.HttpStatus.BAD_REQUEST);
            }
            const isBuyer = task.buyer_id === BigInt(userId);
            const isSeller = task.seller_id === BigInt(userId);
            if (!isBuyer && !isSeller) {
                throw new common_1.HttpException('无权取消该任务', common_1.HttpStatus.FORBIDDEN);
            }
            await tx.tasks.update({
                where: { id: BigInt(id) },
                data: {
                    status: 4,
                    updated_at: new Date(),
                },
            });
            const priceNum = Number(task.price);
            const depositNum = Number(task.deposit);
            if (task.status === 1) {
                await tx.wallets.update({
                    where: { user_id: task.buyer_id },
                    data: {
                        balance: { increment: priceNum },
                        updated_at: new Date(),
                    },
                });
            }
            else if (task.status === 2) {
                let penalty = 0;
                if (depositNum > 0) {
                    penalty = depositNum * 0.1;
                }
                if (isSeller) {
                    await tx.wallets.update({
                        where: { user_id: task.buyer_id },
                        data: { balance: { increment: priceNum + penalty } },
                    });
                    await tx.wallets.update({
                        where: { user_id: task.seller_id },
                        data: {
                            balance: { increment: depositNum - penalty },
                            frozen_balance: { decrement: depositNum },
                        },
                    });
                }
                else if (isBuyer) {
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
                        where: { user_id: task.seller_id },
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
                    status: 3,
                    updated_at: new Date(),
                },
            });
            return { message: '任务已取消，退款/违约金已处理' };
        });
    }
};
exports.TaskService = TaskService;
exports.TaskService = TaskService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService,
        wallet_service_1.WalletService])
], TaskService);
//# sourceMappingURL=task.service.js.map