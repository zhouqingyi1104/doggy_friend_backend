import { IsString, IsInt, IsOptional, IsDecimal, Min, Max, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  title: string;

  @Type(() => Number)
  @IsInt()
  type: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  time_range?: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  deposit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  min_credit?: number;
}
