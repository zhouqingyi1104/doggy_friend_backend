import { GoodsService } from './goods.service';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { BuyGoodsDto } from './dto/buy-goods.dto';
export declare class GoodsController {
    private readonly goodsService;
    constructor(goodsService: GoodsService);
    publish(req: any, createGoodsDto: CreateGoodsDto): Promise<{
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
    buy(req: any, id: string, buyGoodsDto: BuyGoodsDto): Promise<{
        order_id: string;
        message: string;
    }>;
}
