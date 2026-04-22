import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/wechat/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('create')
  createReview(@Request() req, @Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(req.user.app_id, req.user.id, createReviewDto);
  }
}
