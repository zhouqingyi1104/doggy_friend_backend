export declare class WeChatService {
    private readonly logger;
    private readonly weChatLoginUrl;
    private readonly weChatTokenUrl;
    private readonly weChatMsgCheckUrl;
    private readonly SENSITIVE_WORDS;
    checkText(appKey: string, secretKey: string, content: string): Promise<boolean>;
    getSessionInfo(appKey: string, secretKey: string, code: string, iv: string, encryptedData: string): Promise<any>;
    decryptData(encryptedData: string, iv: string, sessionKey: string): string;
}
