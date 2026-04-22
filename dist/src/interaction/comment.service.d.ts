import { PrismaService } from '../prisma/prisma.service';
export declare class CommentService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createComment(userId: bigint, objId: bigint, content: string, objType: number, refCommentId?: bigint, attachments?: string, collegeId?: bigint): Promise<{
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
}
