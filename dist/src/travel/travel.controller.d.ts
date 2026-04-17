import { TravelService } from './travel.service';
export declare class TravelController {
    private readonly travelService;
    constructor(travelService: TravelService);
    runStatistic(req: any): Promise<{
        today_step: number;
        total_step: number;
    }>;
    myRank(req: any): Promise<{
        rank: number;
    }>;
    saveStep(req: any, body: {
        encrypted_data: string;
        iv: string;
        code: string;
    }): Promise<{
        status: string;
        msg: string;
    }>;
    steps(req: any, query: any): Promise<{
        page_data: {
            id: bigint;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            user_id: bigint;
            step: bigint;
            run_at: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    detail(id: string): Promise<{
        error_code: number;
        data: null;
    }>;
}
