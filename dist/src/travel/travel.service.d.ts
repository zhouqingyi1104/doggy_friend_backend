import { PrismaService } from '../prisma/prisma.service';
export declare class TravelService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStatisticStep(userId: bigint): Promise<{
        today_step: number;
        total_step: number;
    }>;
    getMyRank(userId: bigint): Promise<{
        rank: number;
    }>;
    saveStep(userId: bigint, encryptedData: string, iv: string, code: string): Promise<{
        status: string;
        msg: string;
    }>;
    getSteps(userId: bigint, pageSize?: number, pageNumber?: number): Promise<{
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
    getRankList(pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            user: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
            };
            users: undefined;
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
}
