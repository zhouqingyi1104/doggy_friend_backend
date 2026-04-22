import { PrismaService } from '../prisma/prisma.service';
export declare class JobService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createJob(userId: bigint, title: string, content: string, attachments: string, salary: number, endAt: string): Promise<{
        content: string | null;
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string;
        type: number;
        title: string;
        user_id: bigint;
        salary: number;
        end_at: Date | null;
    }>;
    applyJob(userId: bigint, jobId: bigint): Promise<number>;
    getJobList(pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            users: undefined;
            boss: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
            };
            attachments: string[];
            content: string | null;
            id: bigint;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            title: string;
            user_id: bigint;
            salary: number;
            end_at: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    getJobDetail(jobId: bigint): Promise<{
        users: undefined;
        boss: {
            id: bigint;
            nickname: string | null;
            avatar: string | null;
        };
        attachments: string[];
        content: string | null;
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        type: number;
        title: string;
        user_id: bigint;
        salary: number;
        end_at: Date | null;
    }>;
}
