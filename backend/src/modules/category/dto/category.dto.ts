import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';

export class CategoryDto extends BaseDto<CategoryDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  parentCategory?: CategoryDto;

  @AutoMap()
  parentCategorySlug?: CategoryDto;

  @AutoMap()
  title: string;

  @AutoMap()
  icon?: string;

  @AutoMap()
  description?: string;

  @AutoMap()
  slogen?: string;

  @AutoMap()
  slug: string;

  @AutoMap()
  url: string;

  @AutoMap()
  subCategories?: CategoryDto[];
}
