import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentController {
    private readonly commentService;
    constructor(commentService: CommentService);
    store(req: any, body: CreateCommentDto): Promise<{
        content: string;
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        type: number;
        obj_id: bigint;
        obj_type: number;
        commenter_id: bigint;
        ref_comment_id: bigint | null;
    }>;
    list(query: any): Promise<{
        page_data: {
            commenter: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
                gender: number;
            };
            users: undefined;
            ref_comment: any;
            attachments: string[];
            content: string;
            id: bigint;
            college_id: bigint | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            obj_id: bigint;
            obj_type: number;
            commenter_id: bigint;
            ref_comment_id: bigint | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    deleteComment(id: string): Promise<{
        error_code: number;
        data: number;
    }>;
}
