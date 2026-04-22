import { PrismaService } from '../prisma/prisma.service';
export declare class PostService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPost(userId: bigint, collegeId: bigint, content: string, attachments: string, topic: string, isPrivate: number): Promise<{
        content: string | null;
        id: bigint;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        topic: string;
        private: number;
        comment_number: number;
        praise_number: number;
        poster_id: bigint;
    }>;
    getPostList(appId: bigint, currentUserId: bigint, pageSize?: number, pageNumber?: number, type?: number, justMe?: boolean, filter?: string, targetUserId?: bigint): Promise<{
        page_data: {
            id: string;
            poster_id: string;
            college_id: string | null;
            users: undefined;
            poster: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                gender: number;
            };
            has_praise: boolean;
            attachments: string[];
            content: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            topic: string;
            private: number;
            comment_number: number;
            praise_number: number;
        }[];
        total: number;
        page: number;
        page_size: number;
        last_page: number;
    }>;
    getPostDetail(postId: bigint, currentUserId: bigint): Promise<any>;
    private formatSinglePost;
    getLatestTopic(appId: number | bigint): Promise<{
        id: string;
        user_id: string;
        attachments: string[];
        praise_number: string;
        view_number: string;
        comment_number: string;
        content: string | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        app_id: number;
        title: string | null;
        user_type: number;
    } | null>;
    getTopicDetail(topicId: bigint): Promise<{
        id: string;
        user_id: string;
        attachments: string[];
        praise_number: string;
        view_number: string;
        comment_number: string;
        content: string | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        app_id: number;
        title: string | null;
        user_type: number;
    }>;
    getTopicComments(topicId: bigint, pageSize: number, pageNumber: number): Promise<{
        page_data: any[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    getTopicNewComments(topicId: bigint, time: string): Promise<any[]>;
    praiseTopic(topicId: bigint): Promise<{
        id: string;
        user_id: string;
        praise_number: string;
        view_number: string;
        comment_number: string;
        content: string | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        app_id: number;
        title: string | null;
        user_type: number;
    }>;
    private formatComments;
}
