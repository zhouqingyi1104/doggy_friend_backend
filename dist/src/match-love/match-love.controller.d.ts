import { MatchLoveService } from './match-love.service';
import { CreateMatchLoveDto } from './dto/create-match-love.dto';
export declare class MatchLoveController {
    private readonly matchLoveService;
    constructor(matchLoveService: MatchLoveService);
    save(req: any, body: CreateMatchLoveDto): Promise<{
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        password: string | null;
        type: number;
        content: string | null;
        private: number;
        comment_number: number;
        praise_number: number;
        owner_id: bigint;
        user_name: string;
        match_name: string;
        is_password: number;
    }>;
    matchLoves(req: any, query: any): Promise<{
        page_data: never[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    newList(): Promise<{
        error_code: number;
        data: never[];
    }>;
    detail(id: string): Promise<{
        error_code: number;
        data: null;
    }>;
    matchSuccess(id: string): Promise<{
        error_code: number;
        data: null;
    }>;
    destroy(id: string): Promise<{
        error_code: number;
        data: number;
    }>;
}
