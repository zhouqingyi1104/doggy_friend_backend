import { PrismaService } from '../prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService);
    validate(payload: any): Promise<{
        id: bigint;
        mobile: string | null;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        app_id: bigint;
        nickname: string | null;
        password: string | null;
        avatar: string | null;
        gender: number;
        open_id: string | null;
        union_id: string | null;
        city: string;
        country: string;
        language: string;
        province: string;
        type: number;
        remember_token: string | null;
        active_value: number;
        personal_signature: string;
        follow_num: number;
        fans_num: number;
        post_num: number;
        clock_num: number;
        real_name: string | null;
        student_id: string | null;
        credit_score: number;
        level: number;
    }>;
}
export {};
