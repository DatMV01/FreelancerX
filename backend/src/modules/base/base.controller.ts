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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CREATE_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';
import { CurrentUser } from 'src/common/decorators';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from './base.service';
import { PageDto, PageMetaDto } from './dto/pagination';
import { QueryDto } from './dto/query.dto';
import { BaseEntity } from './entities/base.entity';

@UseInterceptors(ClassSerializerInterceptor)
export abstract class BaseController<
  Entity extends BaseEntity,
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
  @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  async create(@Body() data: CreateBaseDto): Promise<Dto> {
    if (Object.keys(data as any).length == 0) {
      throw new BadRequestException('Body is empty');
    }

    const entity = await this.baseService.create(data as any);
    return this.toDtoDefault(entity);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(
    @Query() query: QueryDto<Entity>,
    @CurrentUser() currentUser: any,
  ) {
    const { page, limit, filters, sorts } = query;

    const [results, count] = await this.baseService.findAll(
      page,
      limit,
      filters,
      sorts,
      currentUser,
    );

    const pageDto = new PageDto<Dto>(
      this.toDtoDefault(results),
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: {
          limit,
          page,
          filters,
          sorts,
        },
      }),
    );

    return pageDto;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOneById(@Param('id') id: string) {
    const entity = await this.baseService.findOneById(id);

    if (!entity) {
      throw new NotFoundException(`ID ${id} not found`);
    }

    return this.toDtoDefault(entity);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string) {
    return this.baseService.remove(id);
  }

  toDtoDefault(entity: Entity): Dto;
  toDtoDefault(entity: Entity[]): Dto[];
  toDtoDefault(entity: unknown): Dto | Dto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) => {
        const _mapperObj = this.mapper.map(item, this.entityType, this.dtoType);
        const ___mapperObj = this.additionalMapping(_mapperObj, entity as any);

        return this.createInstance(___mapperObj);
      });
    }

    if (entity) {
      const _mapperObj = this.mapper.map(entity, this.entityType, this.dtoType);
      const ___mapperObj = this.additionalMapping(_mapperObj, entity as any);
      return this.createInstance(___mapperObj);
    }

    return undefined as any;
  }

  protected additionalMapping(dto: Dto, entity: Entity): Dto {
    return dto;
  }

  createInstance(...args: any): Dto {
    return new this.dtoType(...args);
  }

  public getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.baseService.getQueryBuilder();
  }
}
