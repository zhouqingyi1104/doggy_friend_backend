export declare class QiniuService {
    private readonly accessKey;
    private readonly secretKey;
    private readonly bucket;
    private readonly mac;
    constructor();
    getUploadToken(): string;
}
