export declare class WeChatService {
    private readonly logger;
    private readonly weChatLoginUrl;
    getSessionInfo(appKey: string, secretKey: string, code: string, iv: string, encryptedData: string): Promise<any>;
    decryptData(encryptedData: string, iv: string, sessionKey: string): string;
}
