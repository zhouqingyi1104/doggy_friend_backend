import { PostService } from './post.service';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    store(req: any, body: {
        content: string;
        attachments: string;
        location: string;
        private: number;
        username: string;
        mobile: string;
    }): Promise<{
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
    postListLegacy(req: any, query: any): Promise<{
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
    postList(req: any, query: any): Promise<{
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
    detail(req: any, id: string): Promise<any>;
}
