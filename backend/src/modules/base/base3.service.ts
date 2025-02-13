import { Injectable, Type } from '@nestjs/common';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseMapper } from './mapper/base.mapper';

@Injectable()
export class BaseService3<
  BaseEntity extends ObjectLiteral,
  BaseDto,
  CreateBaseDto,
  UpdateBaseDto,
> {
  constructor(
    protected readonly repository: Repository<BaseEntity>,
    private readonly mapper: BaseMapper<
      BaseEntity,
      BaseDto,
      CreateBaseDto,
      UpdateBaseDto
    >,
  ) {}

  async create(createDto: CreateBaseDto): Promise<BaseDto> {
    const entity = this.mapper.toEntityFromCreateDto(createDto);

    const savedEntity = await this.repository.save(entity);

    return this.mapper.toDTO(savedEntity);
  }

  async findOne(id: any): Promise<BaseDto | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<BaseEntity>,
    });

    if (!entity) return null;

    return this.mapper.toDTO(entity);
  }

  async update(id: any, data: UpdateBaseDto): Promise<BaseDto | null> {
    const entity = this.mapper.toEntityFromUpdateDto(data);

    await this.repository.update(id, entity);

    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async removeByCondition(
    where: FindOptionsWhere<BaseEntity>,
  ): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async findExact(
    page: number = 1,
    limit: number = 10,
    options?: FindManyOptions<BaseEntity>,
  ): Promise<[BaseDto[], number]> {
    const [results, count] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      ...options,
    });

    return [this.mapper.toDTOs(results), count];
  }

  async findWithFilters(
    page: number = 1,
    limit: number = 10,
    filters: any = {},
    sort: any = {},
    queryBuilder?: SelectQueryBuilder<BaseEntity>,
  ): Promise<[BaseDto[], number]> {
    if (!queryBuilder) {
      queryBuilder = this.repository.createQueryBuilder();
    }

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

    return [this.mapper.toDTOs(results), count];
  }
}
