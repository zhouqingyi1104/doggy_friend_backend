"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QiniuService = void 0;
const common_1 = require("@nestjs/common");
const qiniu = __importStar(require("qiniu"));
let QiniuService = class QiniuService {
    accessKey;
    secretKey;
    bucket;
    mac;
    constructor() {
        this.accessKey = process.env.QI_NIU_ACCESS_KEY || '';
        this.secretKey = process.env.QI_NIU_SECRET_KEY || '';
        this.bucket = process.env.BUCKET_NAME || '';
        if (!this.accessKey || !this.secretKey) {
            console.warn('Qiniu access key or secret key is not configured.');
        }
        else {
            this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
        }
    }
    getUploadToken() {
        if (!this.mac) {
            throw new common_1.HttpException('服务器未配置七牛云密钥', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
        const options = {
            scope: this.bucket,
            expires: 3600 * 24,
            returnBody: '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","fsize":$(fsize),"width":$(imageInfo.width),"height":$(imageInfo.height)}',
        };
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(this.mac);
        return uploadToken;
    }
};
exports.QiniuService = QiniuService;
exports.QiniuService = QiniuService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QiniuService);
//# sourceMappingURL=qiniu.service.js.map