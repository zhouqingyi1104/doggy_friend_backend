import { PrismaService } from '../prisma/prisma.service';
export declare class SaleFriendService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createSaleFriend(ownerId: bigint, collegeId: bigint, name: string, gender: number, major: string, expectation: string, introduce: string, attachments: string): Promise<{
        id: bigint;
        name: string;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        attachments: string | null;
        gender: number;
        type: number;
        major: string | null;
        comment_number: number;
        praise_number: number;
        owner_id: bigint;
        expectation: string;
        introduce: string;
    }>;
    getSaleFriendsList(appId: bigint, currentUserId: bigint, pageSize?: number, pageNumber?: number, type?: number, justMe?: boolean, orderBy?: string, sortBy?: string, targetUserId?: bigint, collegeId?: bigint): Promise<{
        page_data: {
            users: undefined;
            poster: {
                id: bigint;
                nickname: string | null;
                avatar: string | null;
                gender: number;
            };
            has_praise: boolean;
            attachments: string[];
            id: bigint;
            name: string;
            college_id: bigint | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            gender: number;
            type: number;
            major: string | null;
            comment_number: number;
            praise_number: number;
            owner_id: bigint;
            expectation: string;
            introduce: string;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    getMostNewSaleFriends(appId: bigint, currentUserId: bigint): Promise<{
        users: undefined;
        poster: {
            id: bigint;
            nickname: string | null;
            avatar: string | null;
            gender: number;
        };
        attachments: string[];
        id: bigint;
        name: string;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        gender: number;
        type: number;
        major: string | null;
        comment_number: number;
        praise_number: number;
        owner_id: bigint;
        expectation: string;
        introduce: string;
    }[]>;
    getSaleFriendDetail(id: bigint, currentUserId: bigint): Promise<{
        users: undefined;
        poster: {
            id: bigint;
            nickname: string | null;
            avatar: string | null;
            gender: number;
        };
        has_praise: boolean;
        attachments: string[];
        id: bigint;
        name: string;
        college_id: bigint | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        gender: number;
        type: number;
        major: string | null;
        comment_number: number;
        praise_number: number;
        owner_id: bigint;
        expectation: string;
        introduce: string;
    }>;
    deleteSaleFriend(id: bigint, currentUserId: bigint): Promise<number>;
}
