import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(req: any, createReviewDto: CreateReviewDto): Promise<{
        review_id: string;
        message: string;
    }>;
}
