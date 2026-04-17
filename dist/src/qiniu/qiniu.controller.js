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
exports.QiniuController = void 0;
const common_1 = require("@nestjs/common");
const qiniu_service_1 = require("./qiniu.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let QiniuController = class QiniuController {
    qiniuService;
    constructor(qiniuService) {
        this.qiniuService = qiniuService;
    }
    getUploadToken() {
        const token = this.qiniuService.getUploadToken();
        return { error_code: 0, data: { uptoken: token } };
    }
};
exports.QiniuController = QiniuController;
__decorate([
    (0, common_1.Get)('upload_token'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QiniuController.prototype, "getUploadToken", null);
exports.QiniuController = QiniuController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    __metadata("design:paramtypes", [qiniu_service_1.QiniuService])
], QiniuController);
//# sourceMappingURL=qiniu.controller.js.map