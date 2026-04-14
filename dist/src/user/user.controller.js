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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async personal(req, queryUserId) {
        const userId = queryUserId ? BigInt(queryUserId) : req.user.id;
        return this.userService.getUser(userId);
    }
    async school(req) {
        return this.userService.getSchool(req.user.id);
    }
    async recommendSchool() {
        return this.userService.getRecommendSchools();
    }
    async setCollege(req, collegeId) {
        return this.userService.setCollege(req.user.id, BigInt(collegeId));
    }
    async searchCollege(name) {
        return this.userService.searchCollege(name);
    }
    async clearSchool(req) {
        return this.userService.clearSchool(req.user.id);
    }
    async updateUser(req, body) {
        return this.userService.updateUser(req.user.id, body.nickname, body.avatar);
    }
    async createProfile(req, body) {
        return this.userService.createOrUpdateProfile(req.user.id, body.mobile, body.username, body.grade, body.major, body.student_number, body.college);
    }
    async user(id) {
        return this.userService.getUser(BigInt(id));
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)('personal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "personal", null);
__decorate([
    (0, common_1.Get)('school'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "school", null);
__decorate([
    (0, common_1.Get)('recommend/school'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "recommendSchool", null);
__decorate([
    (0, common_1.Post)('set/college/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setCollege", null);
__decorate([
    (0, common_1.Get)('search/college'),
    __param(0, (0, common_1.Query)('college')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "searchCollege", null);
__decorate([
    (0, common_1.Post)('clear/school'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "clearSchool", null);
__decorate([
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Post)('profile'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createProfile", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "user", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('api/wechat/user'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map