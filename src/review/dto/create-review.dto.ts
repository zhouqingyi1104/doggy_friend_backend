import { IsInt, IsString, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsString()
  order_id: string;

  @Type(() => Number)
  @IsInt()
  order_type: number; // 1 = Task Order, 2 = Goods Order

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
