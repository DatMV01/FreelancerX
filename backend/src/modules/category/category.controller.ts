import { Controller } from '@nestjs/common';
import { BaseController } from '../base/base.controller';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';

@Controller('category')
export class CategoryController extends BaseController<
  CategoryEntity,
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto
> {
  constructor(protected readonly _service: CategoryService) {
    super(_service, CategoryDto, CategoryEntity);
  }
}
