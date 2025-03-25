import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseEntity } from './entities/base.entity';

@Injectable()
export abstract class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  async create(createDto: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findOneById(id: any): Promise<Entity | null> {
    return await this.repository.findOneBy({ id });
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne(options);
  }

  async findOneBySlug(slug: string): Promise<Entity | null> {
    return await this.repository.findOne({
      where: { slug } as unknown as FindOptionsWhere<Entity>,
    });
  }

  async update(id: any, data: DeepPartial<Entity>): Promise<Entity | null> {
    await this.repository.update(id, data as any);
    return this.findOneById(id);
  }

  async remove(id: string | number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async removeByCondition(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: FindOptionsWhere<Entity> | undefined,
    sorts: FindOptionsOrder<Entity> | undefined,
    @CurrentUser() currentUser: any,
  ): Promise<[Entity[], number]> {
    const _queryBuilder: SelectQueryBuilder<Entity> =
      this.repository.createQueryBuilder();

    const appliedFilters = new Set<string>();

    const queryBuilder = this.additionalQuery(
      _queryBuilder,
      appliedFilters,
      filters,
      sorts,
      currentUser,
    );

    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => {
        if (appliedFilters.has(key)) return;

        const _value = filters[key];

        if (!_value) return;

        if (Array.isArray(_value)) {
          queryBuilder.andWhere(
            `${queryBuilder.alias}.${key} IN (:...${key})`,
            {
              [key]: _value,
            },
          );
        } else if (typeof _value === 'string') {
          const value = String(_value).trim().toLowerCase();

          if (value.startsWith('like_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} LIKE ${key}`, {
              [key]: `%${value.replace('like_', '').trim()}%`,
            });
          }
          // larger than
          else if (value.startsWith('>_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key}  > ${key}`, {
              [key]: value.replace('>_', '').trim(),
            });
          }
          // larger than or equal
          else if (value.startsWith('>=_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} >= ${key}`, {
              [key]: value.replace('>=_', '').trim(),
            });
          }
          // smaller than
          else if (value.startsWith('<_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key}  < ${key}`, {
              [key]: value.replace('<_', '').trim(),
            });
          }
          // smaller than or equal
          else if (value.startsWith('<=_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} <= ${key}`, {
              [key]: value.replace('<=_', '').trim(),
            });
          }
          // equal
          else if (value.startsWith('=_')) {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} = ${key}`, {
              [key]: value.replace('=_', '').trim(),
            });
          } else {
            queryBuilder.andWhere(`${queryBuilder.alias}.${key} =:${key}`, {
              [key]: value,
            });
          }
        } else if (!_value) {
          queryBuilder.andWhere(`${queryBuilder.alias}.${key} IS NULL`);
        }
        appliedFilters.add(key);
      });
    }

    if (sorts && Object.keys(sorts).length > 0) {
      Object.keys(sorts).forEach((key) => {
        if (appliedFilters.has(key)) return;

        queryBuilder.addOrderBy(
          `${queryBuilder.alias}.${key}`,
          sorts[key].toUpperCase(),
        );
        appliedFilters.add(key);
      });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getManyAndCount();
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<Entity>,
    appliedFilters: Set<string>,
    filters: any,
    sort: any,
    currentUser: any,
  ): SelectQueryBuilder<Entity> {
    return queryBuilder;
  }

  public getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder();
  }
}
