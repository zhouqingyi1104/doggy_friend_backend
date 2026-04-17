import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    search(keyword: string): Promise<{
        error_code: number;
        data: never[];
    }>;
    location(): Promise<{
        error_code: number;
        data: number;
    }>;
}
