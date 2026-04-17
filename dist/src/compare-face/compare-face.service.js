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
exports.CompareFaceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompareFaceService = class CompareFaceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async compareFace(userId, yourFace, hisFace) {
        const mockScore = Math.floor(Math.random() * 40) + 50;
        const record = await this.prisma.compare_faces.create({
            data: {
                user_id: userId,
                attachments: `${yourFace},${hisFace}`,
                confidence: mockScore,
                status: 1,
                compare_result: JSON.stringify({ score: mockScore, msg: 'Mocked AI result' }),
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        return {
            id: record.id,
            score: mockScore,
            msg: mockScore > 80 ? '天生一对' : '还需努力',
        };
    }
    async getAnimeFace(userId, image) {
        return image;
    }
};
exports.CompareFaceService = CompareFaceService;
exports.CompareFaceService = CompareFaceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompareFaceService);
//# sourceMappingURL=compare-face.service.js.map