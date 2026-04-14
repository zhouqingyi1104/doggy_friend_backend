import { PraiseService } from './praise.service';
export declare class PraiseController {
    private readonly praiseService;
    constructor(praiseService: PraiseService);
    store(req: any, body: {
        obj_id: string;
        obj_type: number;
    }): Promise<{
        id: bigint;
        college_id: bigint | null;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        obj_id: bigint;
        obj_type: number;
        owner_id: bigint;
    }>;
}
