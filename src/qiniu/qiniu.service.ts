import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as qiniu from 'qiniu';

@Injectable()
export class QiniuService {
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly bucket: string;
  private readonly mac: qiniu.auth.digest.Mac;

  constructor() {
    this.accessKey = process.env.QI_NIU_ACCESS_KEY || '';
    this.secretKey = process.env.QI_NIU_SECRET_KEY || '';
    this.bucket = process.env.BUCKET_NAME || '';

    if (!this.accessKey || !this.secretKey) {
      // Avoid crash if not configured, but throw on usage
      console.warn('Qiniu access key or secret key is not configured.');
    } else {
      this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey);
    }
  }

  getUploadToken(): string {
    if (!this.mac) {
      throw new HttpException('服务器未配置七牛云密钥', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const options = {
      scope: this.bucket,
      expires: 3600 * 24, // 24 hours
      returnBody:
        '{"key":"$(key)","hash":"$(etag)","bucket":"$(bucket)","fsize":$(fsize),"width":$(imageInfo.width),"height":$(imageInfo.height)}',
    };

    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(this.mac);

    return uploadToken;
  }
}