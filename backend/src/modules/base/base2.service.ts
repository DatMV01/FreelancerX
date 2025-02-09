import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, Type } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export class BaseService2<
  Entity extends ObjectLiteral,
  Dto,
  CreateBaseDto,
  UpdateBaseDto,
> {
  @InjectMapper() protected readonly mapper: Mapper;

  constructor(
    protected readonly repository: Repository<Entity>,
    private entityType: Type,
    private dtoType: Type,
    private createDtoType: Type,
    private updateDtoType: Type,
  ) {}

  async create(createDto: DeepPartial<CreateBaseDto>): Promise<Dto> {
    const entity = this.toEntityDefault(createDto, this.createDtoType);

    const savedEntity = await this.repository.save(entity);

    return this.toDtoDefault(savedEntity);
  }

  async findOne(id: any): Promise<Dto | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<Entity>,
    });

    if (!entity) return null;

    return this.toDtoDefault(entity);
  }

  async update(id: any, data: DeepPartial<UpdateBaseDto>): Promise<Dto | null> {
    const entity = this.toEntityDefault(data, this.updateDtoType);

    await this.repository.update(id, entity);

    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async removeByCondition(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async findExact(
    page: number = 1,
    limit: number = 10,
    filters: FindOptionsWhere<Entity> = {},
    sort: FindOptionsOrder<Entity> = {},
  ): Promise<[Dto[], number]> {
    const skip = (page - 1) * limit;
    const [results, count] = await this.repository.findAndCount({
      where: filters,
      skip,
      take: limit,
      order: sort,
    });

    return [this.toDtoDefault(results), count];
  }

  async findWithFilters(
    page: number = 1,
    limit: number = 10,
    filters: any = {},
    sort: any = {},
  ): Promise<[Dto[], number]> {
    const queryBuilder: SelectQueryBuilder<Entity> =
      this.repository.createQueryBuilder();

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        queryBuilder.andWhere(`${key} LIKE :${key}`, {
          [key]: `%${filters[key]}%`,
        });
      }
    });

    // // Trong findWithFilters
    // if (filters.price_min) {
    //   queryBuilder.andWhere('product.price >= :price_min', {
    //     price_min: filters.price_min,
    //   });
    // }

    // if (filters.price_max) {
    //   queryBuilder.andWhere('product.price <= :price_max', {
    //     price_max: filters.price_max,
    //   });
    // }

    Object.keys(sort).forEach((key) => {
      queryBuilder.addOrderBy(key, sort[key].toUpperCase());
    });

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [results, count] = await queryBuilder.getManyAndCount();

    return [this.toDtoDefault(results), count];
  }

  toDtoDefault(entity: Entity): Dto;
  toDtoDefault(entity: Entity[]): Dto[];
  toDtoDefault(entity: unknown): Dto | Dto[] {
    if (Array.isArray(entity)) {
      return entity.map((item) =>
        this.createDTOInstance(
          this.mapper.map(item, this.dtoType, this.entityType),
        ),
      );
    }

    if (entity) {
      return this.createDTOInstance(
        this.mapper.map(entity, this.dtoType, this.entityType),
      );
    }

    return undefined as any;
  }

  createDTOInstance(...args: any): Dto {
    return new this.dtoType(...args);
  }

  toEntityDefault(
    dto:
      | DeepPartial<Dto>
      | DeepPartial<CreateBaseDto>
      | DeepPartial<UpdateBaseDto>,
    type: Type,
  ): Entity;
  toEntityDefault(dto: any, type: Type): Entity[];
  toEntityDefault(dto: unknown, type: Type): Entity | Entity[] {
    if (Array.isArray(dto)) {
      return dto.map((item) =>
        this.createEntityInstance(this.mapper.map(item, type, this.dtoType)),
      );
    }

    if (dto) {
      return this.createEntityInstance(
        this.mapper.map(dto, type, this.dtoType),
      );
    }

    return undefined as any;
  }

  createEntityInstance(...args: any): Entity {
    return new this.entityType(...args);
  }

  toDtoChildImpl(entity: Entity): Dto;
  toDtoChildImpl(entity: Entity[]): Dto[];
  toDtoChildImpl(entity: unknown): Dto | Dto[] {
    throw new Error('Child do not implement yet !!!');
  }
}
