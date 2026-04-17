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
exports.SaleFriendController = void 0;
const common_1 = require("@nestjs/common");
const sale_friend_service_1 = require("./sale-friend.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const create_sale_friend_dto_1 = require("./dto/create-sale-friend.dto");
let SaleFriendController = class SaleFriendController {
    saleFriendService;
    constructor(saleFriendService) {
        this.saleFriendService = saleFriendService;
    }
    async save(req, body) {
        const user = req.user;
        const attachmentsStr = Array.isArray(body.attachments)
            ? body.attachments.join(',')
            : (body.attachments || '');
        return this.saleFriendService.createSaleFriend(user.id, user.college_id || BigInt(0), body.name, body.gender || 1, body.major || '', body.expectation || '', body.introduce, attachmentsStr);
    }
    async saleFriends(req, query) {
        const user = req.user;
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        const type = parseInt(query.type, 10) || 1;
        const just = query.just === 'true' || query.just === '1';
        const orderBy = query.order_by || 'created_at';
        const sortBy = query.sort_by || 'desc';
        const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;
        return this.saleFriendService.getSaleFriendsList(user.app_id, user.id, pageSize, pageNumber, type, just, orderBy, sortBy, userId, user.college_id || undefined);
    }
    async saleFriendsV2(req, query) {
        return this.saleFriends(req, query);
    }
    async detail(req, id) {
        return this.saleFriendService.getSaleFriendDetail(BigInt(id), req.user.id);
    }
    async mostNewSaleFriends(req) {
        const user = req.user;
        return this.saleFriendService.getMostNewSaleFriends(user.app_id, user.id);
    }
    async destroy(req, id) {
        return this.saleFriendService.deleteSaleFriend(BigInt(id), req.user.id);
    }
};
exports.SaleFriendController = SaleFriendController;
__decorate([
    (0, common_1.Post)('sale_friend'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_sale_friend_dto_1.CreateSaleFriendDto]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "save", null);
__decorate([
    (0, common_1.Get)('sale_friends'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "saleFriends", null);
__decorate([
    (0, common_1.Get)('sale_friends_v2'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "saleFriendsV2", null);
__decorate([
    (0, common_1.Get)('sale_friend/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('most_new_sale_friend'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "mostNewSaleFriends", null);
__decorate([
    (0, common_1.Delete)('delete/:id/sale_friend'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SaleFriendController.prototype, "destroy", null);
exports.SaleFriendController = SaleFriendController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [sale_friend_service_1.SaleFriendService])
], SaleFriendController);
//# sourceMappingURL=sale-friend.controller.js.map