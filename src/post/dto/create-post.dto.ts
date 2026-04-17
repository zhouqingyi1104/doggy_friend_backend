import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  attachments?: string | string[];

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  private?: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  mobile?: string;
}
