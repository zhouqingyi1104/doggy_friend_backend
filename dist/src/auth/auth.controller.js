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
exports.AuthController = exports.WeChatLoginDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
class WeChatLoginDto {
    app_id;
    code;
    iv;
    encrypted_data;
}
exports.WeChatLoginDto = WeChatLoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '小程序的 AppID (Alliance Key)', example: 'wx1234567890abcdef' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'app_id 不能为空' }),
    __metadata("design:type", String)
], WeChatLoginDto.prototype, "app_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '微信端 wx.login 获取的临时登录凭证 code', example: '013xxx112' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'code 不能为空' }),
    __metadata("design:type", String)
], WeChatLoginDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '加密算法的初始向量 (iv)', example: 'xyz123=' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'iv 不能为空' }),
    __metadata("design:type", String)
], WeChatLoginDto.prototype, "iv", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '包括敏感数据在内的完整用户信息的加密数据', example: 'abc...' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'encrypted_data 不能为空' }),
    __metadata("design:type", String)
], WeChatLoginDto.prototype, "encrypted_data", void 0);
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async apiLogin(body) {
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
    (0, swagger_1.ApiOperation)({ summary: '微信小程序一键登录', description: '接收小程序登录的 code 和加密数据，解密并返回后端业务系统的 JWT Token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '成功返回 Token' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '解密失败或参数错误' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [WeChatLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "apiLogin", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('认证模块 (Auth)'),
    (0, common_1.Controller)('api/wechat'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map