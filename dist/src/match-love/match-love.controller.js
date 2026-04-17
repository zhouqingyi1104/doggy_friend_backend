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
exports.MatchLoveController = void 0;
const common_1 = require("@nestjs/common");
const match_love_service_1 = require("./match-love.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const create_match_love_dto_1 = require("./dto/create-match-love.dto");
let MatchLoveController = class MatchLoveController {
    matchLoveService;
    constructor(matchLoveService) {
        this.matchLoveService = matchLoveService;
    }
    async save(req, body) {
        const user = req.user;
        const attachmentsStr = Array.isArray(body.attachments)
            ? body.attachments.join(',')
            : (body.attachments || '');
        return this.matchLoveService.createMatchLove(user.id, user.college_id || BigInt(0), body.user_name, body.match_name, body.content || '', attachmentsStr, body.private || 1);
    }
    async matchLoves(req, query) {
        const user = req.user;
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        const type = parseInt(query.type, 10) || 1;
        const just = query.just === 'true' || query.just === '1';
        const orderBy = query.order_by || 'created_at';
        const sortBy = query.sort_by || 'desc';
        const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;
        return this.matchLoveService.getMatchLovesList(user.app_id, user.id, pageSize, pageNumber, type, just, orderBy, sortBy, userId, user.college_id || undefined);
    }
    async newList() {
        return { error_code: 0, data: [] };
    }
    async detail(id) {
        return { error_code: 0, data: null };
    }
    async matchSuccess(id) {
        return { error_code: 0, data: null };
    }
    async destroy(id) {
        return { error_code: 0, data: 1 };
    }
};
exports.MatchLoveController = MatchLoveController;
__decorate([
    (0, common_1.Post)('match_love'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_match_love_dto_1.CreateMatchLoveDto]),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "save", null);
__decorate([
    (0, common_1.Get)('match_loves'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "matchLoves", null);
__decorate([
    (0, common_1.Get)('most_new_match_loves'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "newList", null);
__decorate([
    (0, common_1.Get)('match_love/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "detail", null);
__decorate([
    (0, common_1.Get)('match/:id/result'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "matchSuccess", null);
__decorate([
    (0, common_1.Delete)('delete/:id/match_love'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MatchLoveController.prototype, "destroy", null);
exports.MatchLoveController = MatchLoveController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [match_love_service_1.MatchLoveService])
], MatchLoveController);
//# sourceMappingURL=match-love.controller.js.map