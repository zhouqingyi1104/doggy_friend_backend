import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class WeChatService {
  private readonly logger = new Logger(WeChatService.name);
  private readonly weChatLoginUrl = 'https://api.weixin.qq.com/sns/jscode2session';

  async getSessionInfo(appKey: string, secretKey: string, code: string, iv: string, encryptedData: string) {
    const url = `${this.weChatLoginUrl}?appid=${appKey}&secret=${secretKey}&js_code=${code}&grant_type=authorization_code`;
    
    const response = await axios.get(url);
    const result = response.data;

    if (!result.openid) {
      throw new HttpException('小程序登录失败，请检查您的app_id和app_secret是否正确！', HttpStatus.BAD_REQUEST);
    }

    this.logger.debug(`jscode2session result: ${JSON.stringify(result)}`);

    const sessionKey = result.session_key;
    let userInfo: any;
    
    try {
      const decrypted = this.decryptData(encryptedData, iv, sessionKey);
      userInfo = JSON.parse(decrypted);
    } catch (e) {
      throw new HttpException('登录失败，解密错误，请稍后重试', HttpStatus.BAD_REQUEST);
    }

    userInfo.openId = result.openid;
    return userInfo;
  }

  decryptData(encryptedData: string, iv: string, sessionKey: string): string {
    if (sessionKey.length !== 24) {
      throw new HttpException('session_key error', HttpStatus.BAD_REQUEST);
    }
    const aesKey = Buffer.from(sessionKey, 'base64');

    if (iv.length !== 24) {
      throw new HttpException('iv error', HttpStatus.BAD_REQUEST);
    }
    const aesIV = Buffer.from(iv, 'base64');

    const aesCipher = Buffer.from(encryptedData, 'base64');

    try {
      const decipher = crypto.createDecipheriv('aes-128-cbc', aesKey, aesIV);
      decipher.setAutoPadding(true);
      let decrypted = decipher.update(aesCipher, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (e) {
      throw new HttpException('解密失败', HttpStatus.BAD_REQUEST);
    }
  }
}