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
exports.JobService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let JobService = class JobService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createJob(userId, title, content, attachments, salary, endAt) {
        if (!title || !content) {
            throw new common_1.HttpException('标题和内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.part_time_jobs.create({
            data: {
                user_id: userId,
                title,
                content,
                attachments: attachments || '',
                salary: salary || 0,
                end_at: endAt ? new Date(endAt) : new Date(),
                status: 1,
                type: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    async applyJob(userId, jobId) {
        const job = await this.prisma.part_time_jobs.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            throw new common_1.HttpException('悬赏不存在', common_1.HttpStatus.NOT_FOUND);
        }
        if (job.user_id === userId) {
            throw new common_1.HttpException('不能接自己的悬赏令', common_1.HttpStatus.BAD_REQUEST);
        }
        if (job.status !== 1) {
            throw new common_1.HttpException('该悬赏令不处于招募中', common_1.HttpStatus.BAD_REQUEST);
        }
        const existing = await this.prisma.employee_part_time_jobs.findFirst({
            where: { user_id: userId, part_time_job_id: jobId },
        });
        if (existing) {
            throw new common_1.HttpException('您已接过该悬赏令，不能重复接单', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.prisma.$transaction(async (tx) => {
            await tx.employee_part_time_jobs.create({
                data: {
                    user_id: userId,
                    part_time_job_id: jobId,
                    status: 2,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            });
            await tx.part_time_jobs.update({
                where: { id: jobId },
                data: { status: 2, updated_at: new Date() },
            });
        });
        return 1;
    }
    async getJobList(pageSize = 10, pageNumber = 1) {
        const skip = (pageNumber - 1) * pageSize;
        const items = await this.prisma.part_time_jobs.findMany({
            where: { status: 1 },
            skip,
            take: pageSize,
            orderBy: { created_at: 'desc' },
            include: {
                users: { select: { id: true, nickname: true, avatar: true } },
            },
        });
        const total = await this.prisma.part_time_jobs.count({ where: { status: 1 } });
        const formatted = items.map(item => ({
            ...item,
            users: undefined,
            boss: item.users,
            attachments: item.attachments ? item.attachments.split(',') : [],
        }));
        return {
            page_data: formatted,
            total,
            page: pageNumber,
            pageSize,
            last_page: Math.ceil(total / pageSize),
        };
    }
    async getJobDetail(jobId) {
        const item = await this.prisma.part_time_jobs.findUnique({
            where: { id: jobId },
            include: {
                users: { select: { id: true, nickname: true, avatar: true } },
            },
        });
        if (!item) {
            throw new common_1.HttpException('记录不存在', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            ...item,
            users: undefined,
            boss: item.users,
            attachments: item.attachments ? item.attachments.split(',') : [],
        };
    }
};
exports.JobService = JobService;
exports.JobService = JobService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JobService);
//# sourceMappingURL=job.service.js.map