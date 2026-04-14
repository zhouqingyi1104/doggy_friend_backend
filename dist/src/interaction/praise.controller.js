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
exports.PraiseController = void 0;
const common_1 = require("@nestjs/common");
const praise_service_1 = require("./praise.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let PraiseController = class PraiseController {
    praiseService;
    constructor(praiseService) {
        this.praiseService = praiseService;
    }
    async store(req, body) {
        const user = req.user;
        const result = await this.praiseService.createPraise(user.id, BigInt(body.obj_id), body.obj_type || 1);
        return result;
    }
};
exports.PraiseController = PraiseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PraiseController.prototype, "store", null);
exports.PraiseController = PraiseController = __decorate([
    (0, common_1.Controller)('api/wechat/praise'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [praise_service_1.PraiseService])
], PraiseController);
//# sourceMappingURL=praise.controller.js.map