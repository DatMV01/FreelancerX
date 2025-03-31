import {
  Controller,
  Patch,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse
} from '@nestjs/swagger';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
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
    super(
      _service,
      CategoryEntity,
      CategoryDto,
      CreateCategoryDto,
      UpdateCategoryDto,
    );
  }

  @Post()
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: CreateCategoryDto, required: false })
  @ApiResponse({ status: 201, description: 'Entity created successfully' })
  async create(data: CreateCategoryDto): Promise<CategoryDto> {
    return super.create(data);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: UpdateCategoryDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Entity updated successfully',
    type: CategoryDto,
  })
  async update(id: string, data: UpdateCategoryDto): Promise<CategoryDto> {
    return super.update(id, data);
  }
}
