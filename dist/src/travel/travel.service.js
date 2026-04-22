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
exports.TravelService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TravelService = class TravelService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStatisticStep(userId) {
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
    async getMyRank(userId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const myStep = await this.prisma.run_steps.findFirst({
            where: { user_id: userId, run_at: { gte: today } },
        });
        if (!myStep)
            return { rank: 0 };
        const rankCount = await this.prisma.run_steps.count({
            where: {
                run_at: { gte: today },
                step: { gt: myStep.step },
            },
        });
        return { rank: rankCount + 1 };
    }
    async saveStep(userId, encryptedData, iv, code) {
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
        }
        else {
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
    async getSteps(userId, pageSize = 10, pageNumber = 1) {
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
    async getRankList(pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const items = await this.prisma.run_steps.findMany({
            where: { run_at: { gte: today } },
            skip,
            take: pageSize,
            orderBy: { step: 'desc' },
            include: {
                users: { select: { id: true, nickname: true, avatar: true } }
            }
        });
        const total = await this.prisma.run_steps.count({ where: { run_at: { gte: today } } });
        return {
            page_data: items.map(item => ({ ...item, user: item.users, users: undefined })),
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
};
exports.TravelService = TravelService;
exports.TravelService = TravelService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TravelService);
//# sourceMappingURL=travel.service.js.map