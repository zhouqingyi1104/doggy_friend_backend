import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
export declare class JobController {
    private readonly jobService;
    constructor(jobService: JobService);
    store(req: any, body: CreateJobDto): Promise<{
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
    applyJob(req: any, body: {
        id: string;
    }): Promise<number>;
    list(query: any): Promise<{
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
    detail(id: string): Promise<{
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
