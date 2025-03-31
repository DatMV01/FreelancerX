import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateCategoryDto {
  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '1',
    description: 'Parent category ID (if applicable)',
    required: false,
  })
  parentId?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'parent-category',
    description: 'Slug of the parent category',
    required: false,
  })
  parentSlug?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({ example: 'Web Development', description: 'Category title' })
  title: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'icon.png',
    description: 'Icon associated with the category',
    required: false,
  })
  icon?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'All web development services',
    description: 'Description of the category',
    required: false,
  })
  description?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Best web development services',
    description: 'Slogan for the category',
    required: false,
  })
  slogan?: string;

  @AutoMap()
  @IsString()
  @ApiProperty({
    example: 'web-development',
    description: 'SEO-friendly category slug',
  })
  slug: string;

  @AutoMap()
  @IsOptional()
  @IsUrl()
  @ApiPropertyOptional({
    example: '/category/web-development',
    description: 'URL to access this category',
    required: false,
  })
  url?: string;
}
