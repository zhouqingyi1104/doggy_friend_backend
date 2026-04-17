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
    cancelFollow(id: string, type: string): Promise<{
        error_code: number;
        data: null;
    }>;
}
