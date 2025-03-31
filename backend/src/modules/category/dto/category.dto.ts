import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class CategoryDto extends BaseDto<CategoryDto> {
  @AutoMap()
  @ApiProperty({
    example: '1',
    description: 'Unique identifier for the category',
  })
  id: string;

  @AutoMap()
  @ApiProperty({
    example: '0',
    description: 'Parent category ID (null if top-level category)',
  })
  parentId: string;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Reference to the parent category (if applicable)',
  })
  parentCategory?: CategoryDto;

  @AutoMap()
  @ApiPropertyOptional({
    description: 'Slug of the parent category (for SEO purposes)',
  })
  parentCategorySlug?: string;

  @AutoMap()
  @ApiProperty({ example: 'Web Development', description: 'Category title' })
  title: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'icon.png',
    description: 'Icon associated with the category',
  })
  icon?: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'All web development services',
    description: 'Description of the category',
  })
  description?: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: 'Best web development services',
    description: 'Slogan for the category',
  })
  slogan?: string;

  @AutoMap()
  @ApiProperty({
    example: 'web-development',
    description: 'SEO-friendly category slug',
  })
  slug: string;

  @AutoMap()
  @ApiPropertyOptional({
    example: '/category/web-development',
    description: 'URL to access this category',
  })
  url?: string;

  @AutoMap()
  @ApiPropertyOptional({
    type: [CategoryDto],
    description: 'List of subcategories',
  })
  subCategories?: CategoryDto[];
}
