import { AuthService } from './auth.service';
declare class WeChatLoginDto {
    app_id: string;
    code: string;
    iv: string;
    encrypted_data: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    apiLogin(body: WeChatLoginDto): Promise<{
        code: number;
        message: string;
        data: string;
    }>;
}
export {};
