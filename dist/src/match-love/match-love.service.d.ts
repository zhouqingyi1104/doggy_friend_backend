import { PrismaService } from '../prisma/prisma.service';
export declare class MatchLoveService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createMatchLove(ownerId: bigint, collegeId: bigint, userName: string, matchName: string, content: string, attachments: string, isPrivate: number): Promise<{
        content: string | null;
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        password: string | null;
        type: number;
        private: number;
        comment_number: number;
        praise_number: number;
        owner_id: bigint;
        user_name: string;
        match_name: string;
        is_password: number;
    }>;
    getMatchLovesList(appId: bigint, currentUserId: bigint, pageSize?: number, pageNumber?: number, type?: number, justMe?: boolean, orderBy?: string, sortBy?: string, targetUserId?: bigint, collegeId?: bigint): Promise<{
        page_data: never[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
}
