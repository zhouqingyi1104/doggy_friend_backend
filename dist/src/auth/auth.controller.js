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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
class WeChatLoginDto {
    app_id;
    code;
    iv;
    encrypted_data;
}
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async apiLogin(body) {
        if (!body.app_id || !body.code || !body.iv || !body.encrypted_data) {
            throw new common_1.HttpException('缺少必要的登录参数', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const token = await this.authService.weChatLogin(body.app_id, body.code, body.iv, body.encrypted_data);
            return {
                code: 200,
                message: 'success',
                data: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException(error.message || '内部错误', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WeChatLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "apiLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map