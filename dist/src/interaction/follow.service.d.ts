import { PrismaService } from '../prisma/prisma.service';
export declare class FollowService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    toggleFollow(userId: bigint, objId: bigint, objType: number): Promise<{
        status: number;
    }>;
    checkFollow(userId: bigint, objId: bigint, objType: number): Promise<{
        has_follow: boolean;
    }>;
}
