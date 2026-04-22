import { FollowService } from './follow.service';
export declare class FollowController {
    private readonly followService;
    constructor(followService: FollowService);
    toggleFollow(req: any, body: {
        obj_id: string;
        obj_type: number;
    }): Promise<{
        status: number;
    }>;
    checkFollow(req: any, body: {
        obj_id: string;
        obj_type: number;
    }): Promise<{
        has_follow: boolean;
    }>;
    checkFollowUser(req: any, objId: string): Promise<{
        has_follow: boolean;
    }>;
    followUser(req: any, body: {
        obj_id: string;
    }): Promise<{
        status: number;
    }>;
    getFollowPage(req: any, queryObjId?: string, queryUserId?: string, type?: string, pageSize?: string, pageNumber?: string): Promise<{
        page_data: {
            id: string;
            user_id: string;
            obj_id: string;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            obj_type: number;
            follow_nickname: string;
            follow_avatar: string;
            be_follow_nickname: string;
            be_follow_avatar: string;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    cancelFollow(id: string, type: string): Promise<{
        error_code: number;
        data: null;
    }>;
}
