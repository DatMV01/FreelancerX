import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsOrder,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findOne(id: any): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async findOneBySlug(slug: string): Promise<T | null> {
    return await this.repository.findOne({
      where: { slug } as unknown as FindOptionsWhere<T>,
    });
  }

  async update(id: any, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: string | number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async removeByCondition(where: FindOptionsWhere<T>): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: any,
    sort: any,
  ): Promise<[T[], number]> {
    const _queryBuilder: SelectQueryBuilder<T> =
      this.repository.createQueryBuilder();

    const appliedFilters = new Set<string>();

    const queryBuilder = this.additionalQuery(
      _queryBuilder,
      appliedFilters,
      filters,
      sort,
    );

    Object.keys(filters).forEach((key) => {
      if (appliedFilters.has(key)) return;

      const _value = filters[key];

      if (!_value) return;

      if (Array.isArray(_value)) {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} IN (:...${key})`, {
          [key]: _value,
        });
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

    Object.keys(sort).forEach((key) => {
      if (appliedFilters.has(key)) return;

      queryBuilder.addOrderBy(
        `${queryBuilder.alias}.${key}`,
        sort[key].toUpperCase(),
      );
      appliedFilters.add(key);
    });

    queryBuilder.skip((page - 1) * limit).take(limit);

    return queryBuilder.getManyAndCount();
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<T>,
    appliedFilters: Set<string>,
    filters: any,
    sort: any,
  ): SelectQueryBuilder<T> {
    return queryBuilder;
  }
}
