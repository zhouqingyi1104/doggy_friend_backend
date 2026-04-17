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
exports.PostController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const jwt_guard_1 = require("../auth/jwt.guard");
let PostController = class PostController {
    postService;
    constructor(postService) {
        this.postService = postService;
    }
    async store(req, body) {
        const user = req.user;
        const result = await this.postService.createPost(user.id, user.college_id || BigInt(0), body.content, body.attachments, body.username, body.private);
        return result;
    }
    async postListLegacy(req, query) {
        const user = req.user;
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        const just = query.just === 'true' || query.just === '1';
        const type = parseInt(query.type, 10);
        const filter = query.filter;
        const userId = query.user_id ? BigInt(query.user_id) : undefined;
        return this.postService.getPostList(user.app_id, user.id, pageSize, pageNumber, type, just, filter, userId);
    }
    async postList(req, query) {
        const user = req.user;
        const pageSize = parseInt(query.page_size, 10) || 10;
        const pageNumber = parseInt(query.page_number, 10) || 1;
        const just = query.just === 'true' || query.just === '1';
        const type = parseInt(query.type, 10);
        const filter = query.filter;
        const userId = query.user_id ? BigInt(query.user_id) : undefined;
        return this.postService.getPostList(user.app_id, user.id, pageSize, pageNumber, type, just, filter, userId);
    }
    async detail(req, id) {
        return this.postService.getPostDetail(BigInt(id), req.user.id);
    }
};
exports.PostController = PostController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "store", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "postListLegacy", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "postList", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PostController.prototype, "detail", null);
exports.PostController = PostController = __decorate([
    (0, common_1.Controller)('api/wechat/post'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostController);
//# sourceMappingURL=post.controller.js.map