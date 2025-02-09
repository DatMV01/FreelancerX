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
  UseInterceptors,
} from '@nestjs/common';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { FindOptionsOrder, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { BaseService2 } from './base2.service';
import { PageDto, PageMetaDto } from './dto/pagination';
import { QueryDto } from './dto/query.dto';

@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController2<
  Entity extends ObjectLiteral,
  Dto,
  CreateBaseDto,
  UpdateBaseDto,
> {
  @InjectMapper() protected readonly mapper: Mapper;

  constructor(
    protected readonly baseService: BaseService2<
      Entity,
      Dto,
      CreateBaseDto,
      UpdateBaseDto
    >,
  ) {}

  @Post()
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async create(@Body() data: CreateBaseDto): Promise<Dto> {
    if (Object.keys(data as any).length == 0) {
      throw new BadRequestException('Body is empty');
    }

    const entity = await this.baseService.create(data as any);
    return entity;
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
      results,
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
      results,
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

    return entity;
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

    return entity;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.baseService.remove(+id);
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
}
