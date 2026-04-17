import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateSaleFriendDto {
  @IsString()
  @IsNotEmpty({ message: '名字不能为空' })
  name: string;

  @IsNumber()
  @IsOptional()
  gender?: number;

  @IsString()
  @IsOptional()
  major?: string;

  @IsString()
  @IsOptional()
  expectation?: string;

  @IsString()
  @IsNotEmpty({ message: '介绍不能为空' })
  introduce: string;

  @IsOptional()
  attachments?: string | string[];
}
