import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UtilsService } from '../utils/utils.service';
import { WalletService } from '../wallet/wallet.service';
export declare class TaskService {
    private readonly prisma;
    private readonly utilsService;
    private readonly walletService;
    constructor(prisma: PrismaService, utilsService: UtilsService, walletService: WalletService);
    create(appId: number, userId: number, dto: CreateTaskDto): Promise<{
        task_id: string;
        message: string;
    }>;
    findAll(query: any): Promise<{
        total: number;
        page: number;
        page_size: number;
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
                level: number;
            };
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
    }>;
    findMyPublished(userId: bigint, pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            };
            seller: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            } | null;
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    findMyAccepted(userId: bigint, pageSize?: number, pageNumber?: number): Promise<{
        page_data: {
            id: string;
            buyer_id: string;
            seller_id: string | null;
            price: number;
            deposit: number;
            buyer: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            };
            seller: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            } | null;
            location: string | null;
            status: number;
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            type: number;
            description: string | null;
            title: string;
            time_range: string | null;
            min_credit: number;
        }[];
        total: number;
        page: number;
        pageSize: number;
        last_page: number;
    }>;
    findOne(id: string): Promise<{
        id: string;
        buyer_id: string;
        seller_id: string | null;
        price: number;
        deposit: number;
        buyer: {
            id: string;
            nickname: string | null;
            avatar: string | null;
            credit_score: number;
            level: number;
        };
        seller: {
            id: string;
            nickname: string | null;
            avatar: string | null;
            credit_score: number;
            level: number;
        } | null;
        location: string | null;
        status: number;
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        type: number;
        description: string | null;
        title: string;
        time_range: string | null;
        min_credit: number;
    }>;
    accept(userId: number, id: string): Promise<{
        message: string;
    }>;
    complete(userId: number, id: string): Promise<{
        message: string;
    }>;
    cancel(userId: number, id: string, reason: string): Promise<{
        message: string;
    }>;
}
