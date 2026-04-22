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
exports.ReviewService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_service_1 = require("../utils/utils.service");
let ReviewService = class ReviewService {
    prisma;
    utilsService;
    constructor(prisma, utilsService) {
        this.prisma = prisma;
        this.utilsService = utilsService;
    }
    async createReview(appId, reviewerId, dto) {
        if (dto.comment) {
            await this.utilsService.checkText(appId, dto.comment);
        }
        return this.prisma.$transaction(async (tx) => {
            let revieweeId;
            if (dto.order_type === 1) {
                const order = await tx.orders.findUnique({
                    where: { id: BigInt(dto.order_id) },
                    include: { task: true }
                });
                if (!order || order.status !== 2) {
                    throw new common_1.HttpException('任务订单不存在或未完成', common_1.HttpStatus.BAD_REQUEST);
                }
                if (order.task.buyer_id === BigInt(reviewerId)) {
                    revieweeId = order.task.seller_id;
                }
                else if (order.task.seller_id === BigInt(reviewerId)) {
                    revieweeId = order.task.buyer_id;
                }
                else {
                    throw new common_1.HttpException('无权评价此订单', common_1.HttpStatus.FORBIDDEN);
                }
            }
            else if (dto.order_type === 2) {
                const order = await tx.goods_orders.findUnique({
                    where: { id: BigInt(dto.order_id) },
                    include: { goods: true }
                });
                if (!order) {
                    throw new common_1.HttpException('商品订单不存在', common_1.HttpStatus.BAD_REQUEST);
                }
                if (order.buyer_id === BigInt(reviewerId)) {
                    revieweeId = order.goods.seller_id;
                }
                else if (order.goods.seller_id === BigInt(reviewerId)) {
                    revieweeId = order.buyer_id;
                }
                else {
                    throw new common_1.HttpException('无权评价此订单', common_1.HttpStatus.FORBIDDEN);
                }
            }
            else {
                throw new common_1.HttpException('无效的订单类型', common_1.HttpStatus.BAD_REQUEST);
            }
            const existingReview = await tx.reviews.findFirst({
                where: {
                    order_id: BigInt(dto.order_id),
                    reviewer_id: BigInt(reviewerId),
                },
            });
            if (existingReview) {
                throw new common_1.HttpException('您已经评价过该订单了', common_1.HttpStatus.BAD_REQUEST);
            }
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
            let creditChange = 0;
            if (dto.rating >= 4) {
                creditChange = 2;
            }
            else if (dto.rating <= 2) {
                creditChange = -5;
            }
            if (creditChange !== 0) {
                const user = await tx.users.findUnique({ where: { id: revieweeId } });
                if (user) {
                    let newCredit = user.credit_score + creditChange;
                    if (newCredit < 0)
                        newCredit = 0;
                    let newLevel = user.level;
                    if (newCredit >= 200 && user.level < 5) {
                        newLevel = Math.min(5, Math.floor(newCredit / 100));
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
};
exports.ReviewService = ReviewService;
exports.ReviewService = ReviewService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_service_1.UtilsService])
], ReviewService);
//# sourceMappingURL=review.service.js.map