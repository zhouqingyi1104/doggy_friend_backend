import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostController {
    private readonly postService;
    constructor(postService: PostService);
    store(req: any, body: CreatePostDto): Promise<{
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
    postListLegacy(req: any, query: any): Promise<{
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
    postList(req: any, query: any): Promise<{
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
    mostNewPost(): Promise<{
        error_code: number;
        data: {
            page_data: never[];
        };
    }>;
    topic(req: any): Promise<{
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
    topicDetail(id: string): Promise<{
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
    topicComments(id: string, query: any): Promise<{
        page_data: any[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    topicNewComments(id: string, time: string): Promise<any[]>;
    praiseTopic(id: string): Promise<{
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
    detail(req: any, id: string): Promise<any>;
    destroy(req: any, id: string): Promise<{
        error_code: number;
        data: number;
    }>;
}
