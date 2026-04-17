import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMatchLoveDto {
  @IsString()
  @IsNotEmpty({ message: '用户名字不能为空' })
  user_name: string;

  @IsString()
  @IsNotEmpty({ message: '匹配名字不能为空' })
  match_name: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  attachments?: string | string[];

  @IsNumber()
  @IsOptional()
  private?: number;
}
