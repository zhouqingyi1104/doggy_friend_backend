import { PrismaService } from '../prisma/prisma.service';
export declare class InboxService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    send(fromId: bigint, toId: bigint, objId: bigint, content: string, objType: number, actionType: number, postAt: Date): Promise<{
        content: string;
        id: bigint;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        private: boolean;
        obj_id: bigint;
        obj_type: number;
        from_id: bigint;
        to_id: bigint;
        action_type: number;
        post_at: Date | null;
        read_at: Date | null;
    }>;
    getNewInboxCount(userId: bigint, type: string): Promise<number>;
    getUserInbox(userId: bigint, type: string, messageType: string, pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            from_user: any;
            content: string;
            id: bigint;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            private: boolean;
            obj_id: bigint;
            obj_type: number;
            from_id: bigint;
            to_id: bigint;
            action_type: number;
            post_at: Date | null;
            read_at: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
}
