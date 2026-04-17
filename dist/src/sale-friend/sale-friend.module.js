"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleFriendModule = void 0;
const common_1 = require("@nestjs/common");
const sale_friend_controller_1 = require("./sale-friend.controller");
const sale_friend_service_1 = require("./sale-friend.service");
let SaleFriendModule = class SaleFriendModule {
};
exports.SaleFriendModule = SaleFriendModule;
exports.SaleFriendModule = SaleFriendModule = __decorate([
    (0, common_1.Module)({
        controllers: [sale_friend_controller_1.SaleFriendController],
        providers: [sale_friend_service_1.SaleFriendService]
    })
], SaleFriendModule);
//# sourceMappingURL=sale-friend.module.js.map