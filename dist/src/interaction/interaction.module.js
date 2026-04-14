"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionModule = void 0;
const common_1 = require("@nestjs/common");
const praise_controller_1 = require("./praise.controller");
const praise_service_1 = require("./praise.service");
const comment_controller_1 = require("./comment.controller");
const comment_service_1 = require("./comment.service");
const follow_controller_1 = require("./follow.controller");
const follow_service_1 = require("./follow.service");
let InteractionModule = class InteractionModule {
};
exports.InteractionModule = InteractionModule;
exports.InteractionModule = InteractionModule = __decorate([
    (0, common_1.Module)({
        controllers: [praise_controller_1.PraiseController, comment_controller_1.CommentController, follow_controller_1.FollowController],
        providers: [praise_service_1.PraiseService, comment_service_1.CommentService, follow_service_1.FollowService],
        exports: [praise_service_1.PraiseService, comment_service_1.CommentService, follow_service_1.FollowService],
    })
], InteractionModule);
//# sourceMappingURL=interaction.module.js.map