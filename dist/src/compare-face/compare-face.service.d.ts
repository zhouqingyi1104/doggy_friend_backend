import { PrismaService } from '../prisma/prisma.service';
export declare class CompareFaceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    compareFace(userId: bigint, yourFace: string, hisFace: string): Promise<{
        id: bigint;
        score: number;
        msg: string;
    }>;
    getAnimeFace(userId: bigint, image: string): Promise<string>;
}
