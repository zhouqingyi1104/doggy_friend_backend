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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFaceController = void 0;
const common_1 = require("@nestjs/common");
const compare_face_service_1 = require("./compare-face.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let CompareFaceController = class CompareFaceController {
    compareFaceService;
    constructor(compareFaceService) {
        this.compareFaceService = compareFaceService;
    }
    async compareFace(req, body) {
        if (!body.your_face || !body.his_face) {
            throw new common_1.HttpException('照片不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.compareFaceService.compareFace(req.user.id, body.your_face, body.his_face);
    }
    async animeFace(req, body) {
        if (!body.image) {
            throw new common_1.HttpException('图片不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.compareFaceService.getAnimeFace(req.user.id, body.image);
    }
};
exports.CompareFaceController = CompareFaceController;
__decorate([
    (0, common_1.Post)('compare_face'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CompareFaceController.prototype, "compareFace", null);
__decorate([
    (0, common_1.Post)('anime_face'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CompareFaceController.prototype, "animeFace", null);
exports.CompareFaceController = CompareFaceController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [compare_face_service_1.CompareFaceService])
], CompareFaceController);
//# sourceMappingURL=compare-face.controller.js.map