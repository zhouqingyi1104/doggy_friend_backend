import { PrismaService } from '../prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { CreateGoodsDto } from './dto/create-goods.dto';
export declare class GoodsService {
    private readonly prisma;
    private readonly utilsService;
    constructor(prisma: PrismaService, utilsService: UtilsService);
    publish(appId: number, sellerId: number, dto: CreateGoodsDto): Promise<{
        goods_id: string;
        message: string;
    }>;
    findAll(query: any): Promise<{
        total: number;
        page: number;
        page_size: number;
        page_data: {
            id: string;
            seller_id: string;
            price: number;
            seller: {
                id: string;
                nickname: string | null;
                avatar: string | null;
                credit_score: number;
            };
            created_at: Date | null;
            updated_at: Date | null;
            deleted_at: Date | null;
            description: string | null;
            title: string;
            category: string | null;
            stock: number;
        }[];
    }>;
    findOne(id: string): Promise<{
        id: string;
        seller_id: string;
        price: number;
        seller: {
            id: string;
            nickname: string | null;
            avatar: string | null;
            credit_score: number;
        };
        created_at: Date | null;
        updated_at: Date | null;
        deleted_at: Date | null;
        description: string | null;
        title: string;
        category: string | null;
        stock: number;
    }>;
    buy(buyerId: number, goodsId: string, quantity: number): Promise<{
        order_id: string;
        message: string;
    }>;
}
