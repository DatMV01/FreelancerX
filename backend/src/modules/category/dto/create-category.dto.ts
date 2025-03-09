import { AutoMap } from '@automapper/classes';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @AutoMap()
  @IsOptional()
  @IsString()
  parentCategoryId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  parentCategorySlug?: string;

  @AutoMap()
  @IsString()
  title: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  icon?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  description?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  slogen?: string;

  @AutoMap()
  @IsString()
  slug: string;

  @AutoMap()
  @IsUrl()
  url: string;
}
