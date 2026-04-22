import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, friendId: string, body: {
        content?: string;
        attachments?: string | string[];
    }): Promise<{
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
    chatList(req: any, friendId: string, pageSize?: string, pageNumber?: string): Promise<{
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
    newLetter(req: any): Promise<number>;
    getNewMessage(req: any, friendId: string): Promise<{
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
    friends(req: any): Promise<{
        unread_count: any;
        id: bigint;
        nickname: string | null;
        avatar: string | null;
        gender: number;
    }[]>;
    deleteMessage(req: any, messageId: string): Promise<number>;
}
