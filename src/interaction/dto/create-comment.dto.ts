import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: '关联ID不能为空' })
  obj_id: string;

  @IsString()
  @IsNotEmpty({ message: '内容不能为空' })
  content: string;

  @IsNumber()
  @IsOptional()
  type?: number;

  @IsString()
  @IsOptional()
  ref_comment_id?: string;

  @IsOptional()
  attachments?: string | string[];
}
