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
exports.JobController = void 0;
const common_1 = require("@nestjs/common");
const job_service_1 = require("./job.service");
const jwt_guard_1 = require("../auth/jwt.guard");
const create_job_dto_1 = require("./dto/create-job.dto");
let JobController = class JobController {
    jobService;
    constructor(jobService) {
        this.jobService = jobService;
    }
    async store(req, body) {
        const attachmentsStr = Array.isArray(body.attachments)
            ? body.attachments.join(',')
            : (body.attachments || '');
        return this.jobService.createJob(req.user.id, body.title, body.content, attachmentsStr, body.salary || 0, body.end_at || '');
    }
    async applyJob(req, body) {
        return this.jobService.applyJob(req.user.id, BigInt(body.id));
    }
    async list(query) {
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        return this.jobService.getJobList(pageSize, pageNumber);
    }
    async detail(id) {
        return this.jobService.getJobDetail(BigInt(id));
    }
};
exports.JobController = JobController;
__decorate([
    (0, common_1.Post)('part_time_job'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_job_dto_1.CreateJobDto]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "store", null);
__decorate([
    (0, common_1.Post)('apply_job'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "applyJob", null);
__decorate([
    (0, common_1.Get)('part_time_jobs'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('part_time_job/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JobController.prototype, "detail", null);
exports.JobController = JobController = __decorate([
    (0, common_1.Controller)('api/wechat'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [job_service_1.JobService])
], JobController);
//# sourceMappingURL=job.controller.js.map