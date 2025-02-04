import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FindOptionsOrder, ObjectLiteral } from 'typeorm';
import { BaseService } from './base.service';
import { BaseDto } from './dto/base.dto';

@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController<
  Entity extends ObjectLiteral,
  Dto extends BaseDto<Dto>,
  CreateBaseDto,
  UpdateBaseDto,
> {
  constructor(
    protected readonly baseService: BaseService<Entity>,
    private type: new (...args: any) => Dto,
  ) {}

  @Post()
  async create(@Body() createBaseDto: CreateBaseDto): Promise<Dto> {
    if (Object.keys(createBaseDto as any).length == 0) {
      throw new BadRequestException('Body is empty');
    }

    const entity = await this.baseService.create(createBaseDto as any);
    return this.toDtoDefault(entity);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query() filters: any,
    @Query('sort') sort: string = 'name:ASC',
  ) {
    // GET /products?page=1&limit=10&name=ProductName&price=10000&sort=name:ASC,price:DESC

    const sortParams = this.parseSortParam(sort);
    // return this.baseService.findAll(page, limit, filters, sortParams);
    return this.baseService.findWithFilters(page, limit, filters, sort);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.baseService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBaseDto: UpdateBaseDto,
  ): Promise<Dto | null> {
    const entity = await this.baseService.update(id, updateBaseDto as any);
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
      return entity.map((item) => new this.type(item as Entity)) as Dto[];
    }

    if (entity) {
      return new this.type(entity as Entity) as Dto;
    }

    return undefined as any;
  }

  toDtoChildImpl(entity: Entity): Dto;
  toDtoChildImpl(entity: Entity[]): Dto[];
  toDtoChildImpl(entity: unknown): Dto | Dto[] {
    throw new Error('Child do not implement yet !!!');
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
}
