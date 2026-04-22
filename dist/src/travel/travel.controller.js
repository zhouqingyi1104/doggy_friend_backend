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
exports.TravelController = void 0;
const common_1 = require("@nestjs/common");
const travel_service_1 = require("./travel.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let TravelController = class TravelController {
    travelService;
    constructor(travelService) {
        this.travelService = travelService;
    }
    async runStatistic(req) {
        return this.travelService.getStatisticStep(req.user.id);
    }
    async myRank(req) {
        return this.travelService.getMyRank(req.user.id);
    }
    async saveStep(req, body) {
        return this.travelService.saveStep(req.user.id, body.encrypted_data, body.iv, body.code);
    }
    async steps(req, query) {
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        return this.travelService.getSteps(req.user.id, pageSize, pageNumber);
    }
    async randList(req, query) {
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        return this.travelService.getRankList(pageSize, pageNumber);
    }
    async plan() {
        return { error_code: 0, data: null };
    }
    async createTravelPlan(req, body) {
        return { error_code: 0, data: 1 };
    }
    async travelLogs() {
        return { error_code: 0, data: { page_data: [] } };
    }
    async runData(req, body) {
        return this.travelService.saveStep(req.user.id, body.encrypted_data, body.iv, body.code);
    }
};
exports.TravelController = TravelController;
__decorate([
    (0, common_1.Get)('run_statistic'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "runStatistic", null);
__decorate([
    (0, common_1.Get)('my_rank'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "myRank", null);
__decorate([
    (0, common_1.Post)('step_travel'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "saveStep", null);
__decorate([
    (0, common_1.Get)('run_steps'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "steps", null);
__decorate([
    (0, common_1.Get)('rand_list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "randList", null);
__decorate([
    (0, common_1.Get)('plan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "plan", null);
__decorate([
    (0, common_1.Post)('create_travel_plan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "createTravelPlan", null);
__decorate([
    (0, common_1.Get)('ravel_logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "travelLogs", null);
__decorate([
    (0, common_1.Post)('run_data'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TravelController.prototype, "runData", null);
exports.TravelController = TravelController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [travel_service_1.TravelService])
], TravelController);
//# sourceMappingURL=travel.controller.js.map