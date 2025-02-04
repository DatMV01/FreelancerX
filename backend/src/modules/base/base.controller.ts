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
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BaseService } from './base.service';

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
    @Query('sort') sort: string,
    @Query('filters') filters: any,
  ) {
    // GET /roles?page=1&limit=2&filters=name:u&sort=name:desc,id:asc

    const sortParams = this.parseSortParam(sort);
    const filterParams = this.parseFiltersParam(filters);
    // return this.baseService.findAll(page, limit, filterParams, sortParams);
    const results = await this.baseService.findWithFilters(
      page,
      limit,
      filterParams,
      sortParams,
    );
    return this.toDtoDefault(results);
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
      return this.createInstance(
        this.mapper.map(entity, this.dtoType, this.entityType),
      );
    }

    return undefined as any;
  }

  toDtoChildImpl(entity: Entity): Dto;
  toDtoChildImpl(entity: Entity[]): Dto[];
  toDtoChildImpl(entity: unknown): Dto | Dto[] {
    throw new Error('Child do not implement yet !!!');
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
        (sortObj as any)[key] = order === 'DESC' ? 'DESC' : 'ASC';
      });
    }
    return sortObj;
  }

  createInstance(...args: any): Dto {
    return new this.dtoType(...args);
  }
}
