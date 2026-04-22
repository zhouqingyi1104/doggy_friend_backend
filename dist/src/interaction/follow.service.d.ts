import { PrismaService } from '../prisma/prisma.service';
export declare class FollowService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    toggleFollow(userId: bigint, objId: bigint, objType: number): Promise<{
        status: number;
    }>;
    checkFollow(userId: bigint, objId: bigint, objType: number): Promise<{
        has_follow: boolean;
    }>;
    getFollowPage(userId: bigint, type: number, pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            id: string;
            user_id: string;
            obj_id: string;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            obj_type: number;
            follow_nickname: string;
            follow_avatar: string;
            be_follow_nickname: string;
            be_follow_avatar: string;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
}
