import { PrismaService } from '../prisma/prisma.service';
export declare class PostService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPost(userId: bigint, collegeId: bigint, content: string, attachments: string, topic: string, isPrivate: number): Promise<{
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        content: string | null;
        topic: string;
        private: number;
        comment_number: number;
        praise_number: number;
        poster_id: bigint;
    }>;
    getPostList(appId: bigint, currentUserId: bigint, pageSize?: number, pageNumber?: number, type?: number, justMe?: boolean, filter?: string, targetUserId?: bigint): Promise<{
        data: {
            users: undefined;
            poster: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
                gender: number;
            } | {
                id: number;
                nickname: string;
                avatar: string;
                gender: number;
            };
            has_praise: boolean;
            attachments: string[];
            id: bigint;
            college_id: bigint | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            content: string | null;
            topic: string;
            private: number;
            comment_number: number;
            praise_number: number;
            poster_id: bigint;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    getPostDetail(postId: bigint, currentUserId: bigint): Promise<any>;
    private formatSinglePost;
}
