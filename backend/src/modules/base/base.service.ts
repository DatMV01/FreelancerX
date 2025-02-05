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
export class BaseService<T extends ObjectLiteral> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    filters: FindOptionsWhere<T> = {},
    sort: FindOptionsOrder<T> = {},
  ): Promise<T[]> {
    const skip = (page - 1) * limit;
    return this.repository.find({
      where: filters,
      skip,
      take: limit,
      order: sort,
    });
  }

  async findOne(id: any): Promise<T | null> {
    return await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  async update(id: any, data: DeepPartial<T>): Promise<T | null> {
    await this.repository.update(id, data as any);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected || 0) > 0;
  }

  async removeByCondition(where: FindOptionsWhere<T>): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    return (result.affected ?? 0) > 0;
  }

  async findWithFilters(
    page: number = 1,
    limit: number = 10,
    filters: any = {},
    sort: any = {},
  ): Promise<[T[], number]> {
    const queryBuilder: SelectQueryBuilder<T> =
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

    return queryBuilder.getManyAndCount();
  }
}
