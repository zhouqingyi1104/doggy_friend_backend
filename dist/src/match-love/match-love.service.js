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
exports.MatchLoveService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MatchLoveService = class MatchLoveService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createMatchLove(ownerId, collegeId, userName, matchName, content, attachments, isPrivate) {
        if (!userName || !matchName) {
            throw new common_1.HttpException('名字不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.prisma.match_loves.create({
            data: {
                owner_id: ownerId,
                college_id: collegeId || null,
                user_name: userName,
                match_name: matchName,
                content: content || '',
                attachments: attachments || '',
                private: isPrivate || 1,
                is_password: 0,
                type: 1,
                status: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
    }
    async getMatchLovesList(appId, currentUserId, pageSize = 10, pageNumber = 1, type = 1, justMe = false, orderBy = 'created_at', sortBy = 'desc', targetUserId, collegeId) {
        const skip = (pageNumber - 1) * pageSize;
        return {
            page_data: [],
            total: 0,
            page: pageNumber,
            pageSize,
            last_page: 1,
        };
    }
};
exports.MatchLoveService = MatchLoveService;
exports.MatchLoveService = MatchLoveService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MatchLoveService);
//# sourceMappingURL=match-love.service.js.map