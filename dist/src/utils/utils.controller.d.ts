import { UtilsService } from './utils.service';
export declare class UtilsController {
    private readonly utilsService;
    constructor(utilsService: UtilsService);
    checkText(req: any, content: string): Promise<{
        message: string;
    }>;
}
