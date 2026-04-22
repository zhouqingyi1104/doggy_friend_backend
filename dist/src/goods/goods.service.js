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
exports.GoodsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_service_1 = require("../utils/utils.service");
let GoodsService = class GoodsService {
    prisma;
    utilsService;
    constructor(prisma, utilsService) {
        this.prisma = prisma;
        this.utilsService = utilsService;
    }
    async publish(appId, sellerId, dto) {
        await this.utilsService.checkText(appId, dto.title + ' ' + (dto.description || ''));
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
    async findAll(query) {
        const page = parseInt(query.page) || 1;
        const pageSize = parseInt(query.page_size) || 10;
        const category = query.category;
        const where = { deleted_at: null, stock: { gt: 0 } };
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
    async findOne(id) {
        const goods = await this.prisma.goods.findUnique({
            where: { id: BigInt(id) },
            include: {
                seller: {
                    select: { id: true, nickname: true, avatar: true, credit_score: true },
                },
            },
        });
        if (!goods || goods.deleted_at) {
            throw new common_1.HttpException('商品不存在或已下架', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            ...goods,
            id: goods.id.toString(),
            seller_id: goods.seller_id.toString(),
            price: Number(goods.price),
            seller: { ...goods.seller, id: goods.seller.id.toString() },
        };
    }
    async buy(buyerId, goodsId, quantity) {
        return this.prisma.$transaction(async (tx) => {
            const goods = await tx.goods.findUnique({ where: { id: BigInt(goodsId) } });
            if (!goods || goods.deleted_at) {
                throw new common_1.HttpException('商品不存在或已下架', common_1.HttpStatus.NOT_FOUND);
            }
            if (goods.stock < quantity) {
                throw new common_1.HttpException('库存不足', common_1.HttpStatus.BAD_REQUEST);
            }
            if (goods.seller_id === BigInt(buyerId)) {
                throw new common_1.HttpException('不能购买自己的商品', common_1.HttpStatus.BAD_REQUEST);
            }
            const totalAmount = Number(goods.price) * quantity;
            const buyerWallet = await tx.wallets.findUnique({ where: { user_id: BigInt(buyerId) } });
            if (!buyerWallet || Number(buyerWallet.balance) < totalAmount) {
                throw new common_1.HttpException('钱包余额不足，请先充值', common_1.HttpStatus.BAD_REQUEST);
            }
            await tx.wallets.update({
                where: { user_id: BigInt(buyerId) },
                data: { balance: { decrement: totalAmount }, updated_at: new Date() },
            });
            await tx.wallets.update({
                where: { user_id: goods.seller_id },
                data: { balance: { increment: totalAmount }, updated_at: new Date() },
            });
            await tx.goods.update({
                where: { id: BigInt(goodsId) },
                data: { stock: { decrement: quantity }, updated_at: new Date() },
            });
            const order = await tx.goods_orders.create({
                data: {
                    goods_id: BigInt(goodsId),
                    buyer_id: BigInt(buyerId),
                    quantity,
                    amount: totalAmount,
                    status: 1,
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
};
exports.GoodsService = GoodsService;
exports.GoodsService = GoodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService])
], GoodsService);
//# sourceMappingURL=goods.service.js.map