import { ChatService } from './chat.service';
export declare class ChatController {
    private readonly chatService;
    constructor(chatService: ChatService);
    sendMessage(req: any, friendId: string, body: {
        content?: string;
        attachments?: string | string[];
    }): Promise<{
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        type: number;
        content: string | null;
        post_at: Date | null;
        read_at: Date | null;
        from_user_id: bigint;
        to_user_id: bigint;
    }>;
    chatList(req: any, friendId: string, pageSize?: string, pageNumber?: string): Promise<{
        page_data: {
            attachments: string[];
            id: bigint;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            content: string | null;
            post_at: Date | null;
            read_at: Date | null;
            from_user_id: bigint;
            to_user_id: bigint;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    newLetter(req: any): Promise<number>;
    getNewMessage(req: any, friendId: string): Promise<{
        attachments: string[];
        id: bigint;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        type: number;
        content: string | null;
        post_at: Date | null;
        read_at: Date | null;
        from_user_id: bigint;
        to_user_id: bigint;
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
