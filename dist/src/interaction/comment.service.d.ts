import { PrismaService } from '../prisma/prisma.service';
export declare class CommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createComment(userId: bigint, objId: bigint, content: string, objType: number, refCommentId?: bigint, attachments?: string, collegeId?: bigint): Promise<{
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
    getComments(objId: bigint, objType: number, pageSize?: number, pageNumber?: number): Promise<{
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
