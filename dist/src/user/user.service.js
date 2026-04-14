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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UserService = class UserService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUser(id) {
        return this.prisma.users.findUnique({
            where: { id },
        });
    }
    async getSchool(userId) {
        const user = await this.prisma.users.findUnique({
            where: { id: userId },
            include: { colleges: true },
        });
        return user?.colleges?.name || '请选择学校';
    }
    async getRecommendSchools() {
        const colleges = await this.prisma.$queryRaw `SELECT id, name FROM colleges ORDER BY RAND() LIMIT 15`;
        return colleges;
    }
    async setCollege(userId, collegeId) {
        const college = await this.prisma.colleges.findUnique({
            where: { id: collegeId },
        });
        if (!college) {
            throw new common_1.HttpException('学校不存在', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.users.update({
            where: { id: userId },
            data: { college_id: collegeId },
        });
    }
    async searchCollege(name) {
        if (!name) {
            throw new common_1.HttpException('内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.colleges.findMany({
            where: {
                name: {
                    contains: name,
                },
            },
            select: {
                id: true,
                name: true,
            },
            take: 20,
        });
    }
    async clearSchool(userId) {
        return this.prisma.users.update({
            where: { id: userId },
            data: { college_id: null },
        });
    }
    async updateUser(userId, nickname, avatar) {
        if (!nickname || !avatar) {
            throw new common_1.HttpException('昵称或头像不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.users.update({
            where: { id: userId },
            data: {
                nickname,
                avatar,
                updated_at: new Date(),
            },
        });
    }
    async createOrUpdateProfile(userId, mobile, name, grade, major, studentNumber, college) {
        const existing = await this.prisma.user_profiles.findFirst({
            where: { user_id: userId },
        });
        if (existing) {
            return this.prisma.user_profiles.update({
                where: { id: existing.id },
                data: {
                    name: name || existing.name,
                    grade: grade ? parseInt(grade, 10) : existing.grade,
                    major: major || existing.major,
                    student_number: studentNumber || existing.student_number,
                    college: college || existing.college,
                },
            });
        }
        else {
            return this.prisma.user_profiles.create({
                data: {
                    user_id: userId,
                    name: name || '',
                    grade: grade ? parseInt(grade, 10) : 0,
                    major: major || '',
                    student_number: studentNumber || '',
                    college: college || '',
                },
            });
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map