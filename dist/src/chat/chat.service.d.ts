import { PrismaService } from '../prisma/prisma.service';
import { InboxService } from '../inbox/inbox.service';
export declare class ChatService {
    private readonly prisma;
    private readonly inboxService;
    constructor(prisma: PrismaService, inboxService: InboxService);
    sendMessage(userId: bigint, friendId: bigint, content: string, attachments: string): Promise<{
        content: string | null;
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        type: number;
        post_at: Date | null;
        read_at: Date | null;
        from_user_id: bigint;
        to_user_id: bigint;
        task_id: bigint | null;
    }>;
    getChatList(userId: bigint, friendId: bigint, pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            attachments: string[];
            content: string | null;
            id: bigint;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            post_at: Date | null;
            read_at: Date | null;
            from_user_id: bigint;
            to_user_id: bigint;
            task_id: bigint | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    getNewMessages(userId: bigint, friendId: bigint): Promise<{
        attachments: string[];
        content: string | null;
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        type: number;
        post_at: Date | null;
        read_at: Date | null;
        from_user_id: bigint;
        to_user_id: bigint;
        task_id: bigint | null;
    }[]>;
    getNewLetterCount(userId: bigint): Promise<number>;
    getFriends(userId: bigint): Promise<{
        unread_count: any;
        id: bigint;
        nickname: string | null;
        avatar: string | null;
        gender: number;
    }[]>;
    deleteMessage(userId: bigint, messageId: bigint): Promise<number>;
}
