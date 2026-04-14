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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WeChatService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
let WeChatService = WeChatService_1 = class WeChatService {
    logger = new common_1.Logger(WeChatService_1.name);
    weChatLoginUrl = 'https://api.weixin.qq.com/sns/jscode2session';
    async getSessionInfo(appKey, secretKey, code, iv, encryptedData) {
        const url = `${this.weChatLoginUrl}?appid=${appKey}&secret=${secretKey}&js_code=${code}&grant_type=authorization_code`;
        const response = await axios_1.default.get(url);
        const result = response.data;
        if (!result.openid) {
            throw new common_1.HttpException('小程序登录失败，请检查您的app_id和app_secret是否正确！', common_1.HttpStatus.BAD_REQUEST);
        }
        this.logger.debug(`jscode2session result: ${JSON.stringify(result)}`);
        const sessionKey = result.session_key;
        let userInfo;
        try {
            const decrypted = this.decryptData(encryptedData, iv, sessionKey);
            userInfo = JSON.parse(decrypted);
        }
        catch (e) {
            throw new common_1.HttpException('登录失败，解密错误，请稍后重试', common_1.HttpStatus.BAD_REQUEST);
        }
        userInfo.openId = result.openid;
        return userInfo;
    }
    decryptData(encryptedData, iv, sessionKey) {
        if (sessionKey.length !== 24) {
            throw new common_1.HttpException('session_key error', common_1.HttpStatus.BAD_REQUEST);
        }
        const aesKey = Buffer.from(sessionKey, 'base64');
        if (iv.length !== 24) {
            throw new common_1.HttpException('iv error', common_1.HttpStatus.BAD_REQUEST);
        }
        const aesIV = Buffer.from(iv, 'base64');
        const aesCipher = Buffer.from(encryptedData, 'base64');
        try {
            const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, aesIV);
            decipher.setAutoPadding(true);
            let decrypted = decipher.update(aesCipher, undefined, 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }
        catch (e) {
            throw new common_1.HttpException('解密失败', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.WeChatService = WeChatService;
exports.WeChatService = WeChatService = WeChatService_1 = __decorate([
    (0, common_1.Injectable)()
], WeChatService);
//# sourceMappingURL=wechat.service.js.map