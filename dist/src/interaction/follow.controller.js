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
exports.FollowController = void 0;
const common_1 = require("@nestjs/common");
const follow_service_1 = require("./follow.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let FollowController = class FollowController {
    followService;
    constructor(followService) {
        this.followService = followService;
    }
    async toggleFollow(req, body) {
        return this.followService.toggleFollow(req.user.id, BigInt(body.obj_id), body.obj_type || 1);
    }
    async checkFollow(req, body) {
        return this.followService.checkFollow(req.user.id, BigInt(body.obj_id), body.obj_type || 1);
    }
    async checkFollowUser(req, objId) {
        return this.followService.checkFollow(req.user.id, BigInt(objId), 1);
    }
    async followUser(req, body) {
        return this.followService.toggleFollow(req.user.id, BigInt(body.obj_id), 1);
    }
    async getFollowPage(req, queryObjId, queryUserId, type, pageSize, pageNumber) {
        let userId = req.user.id;
        if (queryUserId && queryUserId !== '0' && queryUserId !== 'undefined') {
            userId = BigInt(queryUserId);
        }
        return this.followService.getFollowPage(userId, parseInt(type || '1', 10), parseInt(pageSize || '10', 10), parseInt(pageNumber || '1', 10));
    }
    async cancelFollow(id, type) {
        return { error_code: 0, data: null };
    }
};
exports.FollowController = FollowController;
__decorate([
    (0, common_1.Post)('follow'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "toggleFollow", null);
__decorate([
    (0, common_1.Post)('follow/check'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "checkFollow", null);
__decorate([
    (0, common_1.Get)('follow/user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('obj_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "checkFollowUser", null);
__decorate([
    (0, common_1.Post)('follow_user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "followUser", null);
__decorate([
    (0, common_1.Get)('follow/page'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('obj_id')),
    __param(2, (0, common_1.Query)('user_id')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('page_size')),
    __param(5, (0, common_1.Query)('page_number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "getFollowPage", null);
__decorate([
    (0, common_1.Put)('cancel/:id/follow/:type'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], FollowController.prototype, "cancelFollow", null);
exports.FollowController = FollowController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [follow_service_1.FollowService])
], FollowController);
//# sourceMappingURL=follow.controller.js.map