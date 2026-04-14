import { QiniuService } from './qiniu.service';
export declare class QiniuController {
    private readonly qiniuService;
    constructor(qiniuService: QiniuService);
    getUploadToken(): {
        uptoken: string;
    };
}
