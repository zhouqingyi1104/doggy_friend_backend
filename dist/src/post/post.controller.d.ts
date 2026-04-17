import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    store(req: any, body: CreatePostDto): Promise<{
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
        page_data: {
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
        page_data: {
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
    mostNewPost(): Promise<{
        error_code: number;
        data: {
            page_data: never[];
        };
    }>;
    topic(): Promise<{
        error_code: number;
        data: null;
    }>;
    praiseTopic(id: string): Promise<{
        error_code: number;
        data: null;
    }>;
    detail(req: any, id: string): Promise<any>;
    destroy(req: any, id: string): Promise<{
        error_code: number;
        data: number;
    }>;
}
