import { CommentService } from './comment.service';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    store(req: any, body: {
        obj_id: string;
        content: string;
        type: number;
        ref_comment_id?: string;
        attachments?: string;
    }): Promise<{
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        type: number;
        content: string;
        obj_id: bigint;
        obj_type: number;
        ref_comment_id: bigint | null;
        commenter_id: bigint;
    }>;
    list(query: any): Promise<{
        data: {
            commenter: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
                gender: number;
            };
            users: undefined;
            ref_comment: any;
            attachments: string[];
            id: bigint;
            college_id: bigint | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            content: string;
            obj_id: bigint;
            obj_type: number;
            ref_comment_id: bigint | null;
            commenter_id: bigint;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
}
