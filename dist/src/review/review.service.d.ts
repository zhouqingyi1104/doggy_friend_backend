import { PrismaService } from '../prisma/prisma.service';
import { UtilsService } from '../utils/utils.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewService {
    private readonly prisma;
    private readonly utilsService;
    constructor(prisma: PrismaService, utilsService: UtilsService);
    createReview(appId: number, reviewerId: number, dto: CreateReviewDto): Promise<{
        review_id: string;
        message: string;
    }>;
}
