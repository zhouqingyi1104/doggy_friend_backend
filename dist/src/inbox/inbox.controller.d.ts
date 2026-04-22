import { InboxService } from './inbox.service';
export declare class InboxController {
    private readonly inboxService;
    constructor(inboxService: InboxService);
    getNewInbox(req: any, type: string): Promise<number>;
    userInbox(req: any, type: string, messageType: string, pageSize?: string, pageNumber?: string): Promise<{
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
