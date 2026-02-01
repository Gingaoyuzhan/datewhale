import { IsString, MinLength, MaxLength, IsOptional, IsArray } from 'class-validator';

export class CreateEntryDto {
  @IsString()
  @MinLength(10, { message: '日记内容至少10个字' })
  @MaxLength(5000, { message: '日记内容最多5000个字' })
  content: string;

  @IsOptional()
  @IsString()
  emotionPrimary?: string;

  @IsOptional()
  @IsArray()
  emotionSecondary?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // 图片 base64 数据数组，用于 AI 分析
}
