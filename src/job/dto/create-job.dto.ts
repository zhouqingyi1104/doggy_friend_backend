import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty({ message: '标题不能为空' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsOptional()
  attachments?: string | string[];

  @IsNumber()
  @IsOptional()
  salary?: number;

  @IsString()
  @IsOptional()
  end_at?: string;
}
