import { PrismaService } from '../prisma/prisma.service';
export declare class PraiseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPraise(userId: bigint, objId: bigint, objType: number): Promise<{
        id: bigint;
        college_id: bigint | null;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        obj_id: bigint;
        obj_type: number;
        owner_id: bigint;
    }>;
}
