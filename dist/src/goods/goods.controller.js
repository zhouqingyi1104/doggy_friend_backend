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
exports.GoodsController = void 0;
const common_1 = require("@nestjs/common");
const goods_service_1 = require("./goods.service");
const create_goods_dto_1 = require("./dto/create-goods.dto");
const buy_goods_dto_1 = require("./dto/buy-goods.dto");
const jwt_guard_1 = require("../auth/jwt.guard");
let GoodsController = class GoodsController {
    goodsService;
    constructor(goodsService) {
        this.goodsService = goodsService;
    }
    publish(req, createGoodsDto) {
        return this.goodsService.publish(req.user.app_id, req.user.id, createGoodsDto);
    }
    findAll(query) {
        return this.goodsService.findAll(query);
    }
    findOne(id) {
        return this.goodsService.findOne(id);
    }
    buy(req, id, buyGoodsDto) {
        return this.goodsService.buy(req.user.id, id, buyGoodsDto.quantity);
    }
};
exports.GoodsController = GoodsController;
__decorate([
    (0, common_1.Post)('publish'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_goods_dto_1.CreateGoodsDto]),
    __metadata("design:returntype", void 0)
], GoodsController.prototype, "publish", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GoodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/buy'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, buy_goods_dto_1.BuyGoodsDto]),
    __metadata("design:returntype", void 0)
], GoodsController.prototype, "buy", null);
exports.GoodsController = GoodsController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/wechat/goods'),
    __metadata("design:paramtypes", [goods_service_1.GoodsService])
], GoodsController);
//# sourceMappingURL=goods.controller.js.map