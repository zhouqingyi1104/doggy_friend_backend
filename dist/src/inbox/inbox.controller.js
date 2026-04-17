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
exports.InboxController = void 0;
const common_1 = require("@nestjs/common");
const inbox_service_1 = require("./inbox.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let InboxController = class InboxController {
    inboxService;
    constructor(inboxService) {
        this.inboxService = inboxService;
    }
    async getNewInbox(req, type) {
        return this.inboxService.getNewInboxCount(req.user.id, type);
    }
    async userInbox(req, type, messageType, pageSize, pageNumber) {
        return this.inboxService.getUserInbox(req.user.id, type, messageType, parseInt(pageSize || '10', 10), parseInt(pageNumber || '1', 10));
    }
};
exports.InboxController = InboxController;
__decorate([
    (0, common_1.Get)('new/:type/inbox'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InboxController.prototype, "getNewInbox", null);
__decorate([
    (0, common_1.Get)('user/:type/inbox/:messageType'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Param)('messageType')),
    __param(3, (0, common_1.Query)('page_size')),
    __param(4, (0, common_1.Query)('page_number')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], InboxController.prototype, "userInbox", null);
exports.InboxController = InboxController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [inbox_service_1.InboxService])
], InboxController);
//# sourceMappingURL=inbox.controller.js.map