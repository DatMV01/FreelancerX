import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BaseService } from './base.service';
import { PageDto, PageMetaDto } from './dto/pagination';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { QueryDto } from './dto/query.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController<
  Entity extends ObjectLiteral,
  Dto,
  CreateBaseDto,
  UpdateBaseDto,
> {
  @InjectMapper() protected readonly mapper: Mapper;

  constructor(
    protected readonly baseService: BaseService<Entity>,
    private dtoType: Type,
    private entityType: Type,
  ) {}

  @Post()
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async create(@Body() data: CreateBaseDto): Promise<Dto> {
    if (Object.keys(data as any).length == 0) {
      throw new BadRequestException('Body is empty');
    }

    const entity = await this.baseService.create(data as any);
    return this.toDtoDefault(entity);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sort') sort: string = 'updatedAt:desc,createdAt:desc',
    @Query('filters') filters: any,
  ) {
    // GET /roles?page=1&limit=2&filters=name:u&sort=name:desc,id:asc
    const _limit = Math.min(limit || 10, 50);

    const sortParams = this.parseSortParam(sort);
    const filterParams = this.parseFiltersParam(filters);
    // return this.baseService.findAll(page, limit, filterParams, sortParams);
    const [results, count] = await this.baseService.findWithFilters(
      page,
      _limit,
      filterParams,
      sortParams,
    );

    const pageDto = new PageDto<Dto>(
      this.toDtoDefault(results),
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: {
          limit: _limit,
          page,
          filters: filterParams,
          sort: sortParams,
        },
      }),
    );

    return pageDto;
  }

  @Get('/findexact')
  @ApiOperation({
    summary: 'Exact search',
    description:
      'This API allows searching for entities based on filters and sorting.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of results per page (default: 10, max: 50)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sorting format: field:ASC|DESC,field2:ASC|DESC',
  })
  @ApiQuery({
    name: 'filters',
    required: false,
    type: String,
    description: 'Filtering format: field:value,field2:value',
  })
  @ApiResponse({
    status: 200,
    description: 'List of results returned successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid parameters.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findExact(@Query() query: QueryDto<Entity>) {
    // GET /roles?page=1&limit=2&filters=name:u&sort=name:desc,id:asc

    const { page, _limit: limit, sort, filters } = query;

    // return this.baseService.findAll(page, limit, filterParams, sortParams);
    const [results, count] = await this.baseService.findExact(
      page,
      limit,
      filters,
      sort,
    );

    const pageDto = new PageDto<Dto>(
      this.toDtoDefault(results),
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: {
          limit,
          page,
          filters,
          sort,
        },
      }),
    );

    return pageDto;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const entity = await this.baseService.findOne(+id);

    if (!entity) {
      throw new NotFoundException(`ID ${id} not found`);
    }

    return this.toDtoDefault(entity);
  }

  @Patch(':id')
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateBaseDto,
  ): Promise<Dto | null> {
    const entity = await this.baseService.update(id, data as any);

    if (!entity) {
      throw new NotFoundException(`ID ${id} not found`);
    }

    return this.toDtoDefault(entity as any);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.baseService.remove(+id);
  }

  toDtoDefault(entity: Entity): Dto;
  toDtoDefault(entity: Entity[]): Dto[];
  toDtoDefault(entity: unknown): Dto | Dto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) =>
        this.createInstance(
          this.mapper.map(item, this.dtoType, this.entityType),
        ),
      );
    }

    if (entity) {
      const _mapperObj = this.mapper.map(entity, this.dtoType, this.entityType);
      const ___mapperObj = this.additionalMapping(_mapperObj, entity as any);
      return this.createInstance(___mapperObj);
    }

    return undefined as any;
  }

  protected additionalMapping(dto: Dto, entity: Entity): Dto {
    return dto;
  }

  private parseFiltersParam(filters: string): FindOptionsWhere<Entity> {
    const filtersObj: FindOptionsWhere<Entity> = {};
    if (filters) {
      const filterFields = filters.split(',');
      filterFields.forEach((field) => {
        const [key, value] = field.split(':');
        (filtersObj as any)[key] = value;
      });
    }
    return filtersObj;
  }

  private parseSortParam(sort: string): FindOptionsOrder<Entity> {
    const sortObj: FindOptionsOrder<Entity> = {};
    if (sort) {
      const sortFields = sort.split(',');
      sortFields.forEach((field) => {
        const [key, order] = field.split(':');
        (sortObj as any)[key] = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      });
    }
    return sortObj;
  }

  createInstance(...args: any): Dto {
    return new this.dtoType(...args);
  }
}
