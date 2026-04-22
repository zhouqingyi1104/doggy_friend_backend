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
exports.UtilsController = void 0;
const common_1 = require("@nestjs/common");
const utils_service_1 = require("./utils.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let UtilsController = class UtilsController {
    utilsService;
    constructor(utilsService) {
        this.utilsService = utilsService;
    }
    async checkText(req, content) {
        if (!content) {
            throw new common_1.HttpException('内容不能为空', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.utilsService.checkText(req.user.app_id, content);
        return { message: '检测通过' };
    }
};
exports.UtilsController = UtilsController;
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Post)('check_text'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)('content')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "checkText", null);
exports.UtilsController = UtilsController = __decorate([
    (0, common_1.Controller)('api/wechat/utils'),
    __metadata("design:paramtypes", [utils_service_1.UtilsService])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map