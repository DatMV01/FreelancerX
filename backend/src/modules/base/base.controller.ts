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
  Version,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ADMIN_GROUP,
  CREATE_GROUP,
  ME_GROUP,
  UPDATE_GROUP,
} from 'src/common/constant/serialize.group';

import { CurrentUser } from 'src/common/decorators';
import { consoleError } from 'src/utils/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseService } from './base.service';
import { PageDto, PageMetaDto } from './dto/pagination';
import { QueryDto } from './dto/query.dto';
import { BaseEntity } from './entities/base.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(PageDto, PageMetaDto)
export abstract class BaseController<
  Entity extends BaseEntity,
  Dto,
  CreateBaseDto,
  UpdateBaseDto,
> {
  @InjectMapper() protected readonly mapper: Mapper;

  constructor(
    protected readonly baseService: BaseService<Entity>,
    private entityType: Type<Entity>,
    private dtoType: Type<Dto>,
    private createDtoType: Type<CreateBaseDto>,
    private updateDtoType: Type<UpdateBaseDto>,
  ) {}

  @Post()
  // // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [CREATE_GROUP] })
  @ApiOperation({ summary: 'Create a new entity' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 201, description: 'Entity created successfully' })
  async create(@Body() data: CreateBaseDto): Promise<Dto> {
    if (!Object.keys(data as Record<string, any>).length) {
      throw new BadRequestException('Body is empty');
    }

    const entity = this.mapper.map(data, this.createDtoType, this.entityType);
    const savedEntity = await this.baseService.create(entity);
    return this.mapFromEntityToDto(savedEntity);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<Dto>,
  })
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

    return new PageDto<Dto>(
      this.mapFromEntityToDto(results),
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: { limit, page, filters, sorts },
      }),
    );
  }

  @Get()
  @Version('2')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all entities' })
  @ApiResponse({
    status: 200,
    description: 'List of entities',
    type: PageDto<Dto>,
  })
  async findAll2(
    @Query() query: QueryDto<Entity>,
    @CurrentUser() currentUser: any,
  ) {
    const { page, limit, filters, sorts } = query;

    const [results, count] = await this.baseService.findAll2(
      page,
      limit,
      filters,
      sorts,
      currentUser,
    );

    return new PageDto<Dto>(
      this.mapFromEntityToDto(results),
      new PageMetaDto({
        itemCount: count,
        pageOptionsDto: { limit, page, filters, sorts },
      }),
    );
  }

  @Get(':id')
  // // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get an entity by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity found' })
  async findOneById(@Param('id') id: string) {
    const entity = await this.baseService.findOneById(id);

    return this.mapFromEntityToDto(entity);
  }

  @Get('/me/:id')
  // // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [ADMIN_GROUP, ME_GROUP] })
  async me(@Param('id') id: string) {
    return this.findOneById(id);
  }

  @Patch(':id')
  // // @UseGuards(AuthGuard('jwt'))
  @SerializeOptions({ groups: [UPDATE_GROUP] })
  @ApiOperation({ summary: 'Update an entity' })
  @ApiParam({ name: 'id', type: String, required: false })
  @ApiBody({ type: Object, required: false })
  @ApiResponse({ status: 200, description: 'Entity updated successfully' })
  async update(
    @Param('id') id: string | number,
    @Body() data: UpdateBaseDto,
  ): Promise<Dto> {
    if (!Object.keys(data as Record<string, any>).length) {
      throw new BadRequestException('Update data cannot be empty');
    }

    const entity = this.mapper.map(data, this.updateDtoType, this.entityType);
    const updatedEntity = await this.baseService.update(id, entity);

    return this.mapFromEntityToDto(updatedEntity);
  }

  @Delete(':id')
  // // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Soft delete an entity' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.baseService.removeOneById(id);
  }

  @Delete('/hard/:id')
  // // @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Hard delete an entity' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Entity deleted successfully' })
  async removeHard(@Param('id') id: string) {
    return this.baseService.removeHardOneById(id);
  }

  mapFromEntityToDto(entity: Entity): Dto;
  mapFromEntityToDto(entity: Entity[]): Dto[];
  mapFromEntityToDto(entity: Entity | Entity[]): Dto | Dto[] {
    if (!entity) return {} as any;

    return Array.isArray(entity)
      ? entity.map((item) => this.transformToDto(item))
      : this.transformToDto(entity);
  }

  private transformToDto(item: Entity): Dto {
    const mappedDto = this.mapper.map(item, this.entityType, this.dtoType);
    return this.additionalMapping(mappedDto, item);
  }

  protected additionalMapping(dto: Dto, entity: Entity): Dto {
    return dto;
  }

  public getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.baseService.getQueryBuilder();
  }

  public getEntityMapping(data: CreateBaseDto) {
    return this.mapper.map(data, this.createDtoType, this.entityType);
  }
}
