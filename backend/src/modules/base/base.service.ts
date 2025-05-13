import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { consoleError } from 'src/utils/common';
import {
  buildOrderClause,
  buildWhereClause,
  QueryInput,
} from 'src/utils/typeorm-utils';
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseEntity } from './entities/base.entity';

@Injectable()
export abstract class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  @Inject(DataSource) protected readonly dataSource: DataSource;

  async create(createDto: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findOneById(id: BaseEntity['id']): Promise<Entity> {
    return this.findOne({
      where: { id } as any,
    });
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.repository.findOne(options);
    if (!entity) throw new NotFoundException('Entity not found');

    return entity;
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<Entity>,
  ): Promise<Entity> {
    const entity = await this.findOneById(id);
    const updated = Object.assign(entity, data);
    return this.repository.save(updated);
  }

  // DELETE (Soft Delete)
  async removeSoftOneById(id: BaseEntity['id']): Promise<boolean> {
    return this.removeSoft({ id } as any);
  }

  async removeHardOneById(id: BaseEntity['id']): Promise<boolean> {
    return this.removeHard({ id } as any);
  }

  async removeSoft(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const result = await this.repository.softDelete(where);

    if (!result.affected)
      throw new NotFoundException('Entity not found or already deleted');

    return true;
  }

  async removeHard(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const result = await this.repository.delete(where);

    if (!result.affected)
      throw new NotFoundException('Entity not found or already deleted');

    return true;
  }

  // RESTORE (Restore soft deleted entity)
  async restore(id: number): Promise<void> {
    const result = await this.repository.restore(id);
    if (!result.affected)
      throw new NotFoundException(`Entity with ID ${id} not found`);
  }

  async existsByAndThrowExeption(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<boolean> {
    const isExisted = await this.repository.existsBy(where);

    if (isExisted) {
      throw new UnprocessableEntityException(
        `Entity with ${JSON.stringify(where)} is already existed`,
      );
    }

    return isExisted;
  }

  async existsBy(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
  ): Promise<boolean> {
    return await this.repository.existsBy(where);
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

  public createQueryBuilder(alias: string): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias);
  }

  async findAll2(
    queryObj: QueryInput<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<[Entity[], number]> {
    const { page, pageSize, sorts, filters, fields } = queryObj;

    try {
      let options: FindManyOptions<Entity> = {
        where: buildWhereClause(filters),
        order: buildOrderClause(sorts),
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: fields ? (fields as any) : undefined,
      };

      options = await this.modifyFindManyOptions(options, currentUser);

      const result = await this.repository.findAndCount(options);

      return result;
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async findAll2_V2(
    queryObj: QueryInput<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<[Entity[], number]> {
    const { page, pageSize, sorts, filters, fields } = queryObj;

    try {
      // Sử dụng buildWhereClause để tạo điều kiện WHERE
      const whereClause = buildWhereClause(filters);

      // Sử dụng buildOrderClause2 để tạo điều kiện ORDER BY
      const orderClause = buildOrderClause(sorts);

      const queryBuilder =
        this.repository.createQueryBuilder() as SelectQueryBuilder<Entity>;

      // Áp dụng WHERE và ORDER BY
      queryBuilder.where(whereClause).orderBy(orderClause as any);

      // Phân trang
      if (page && pageSize) {
        queryBuilder.skip((page - 1) * pageSize).take(pageSize);
      }

      // Lựa chọn các trường cần lấy (fields)
      if (fields) {
        queryBuilder.select(fields as any);
      }

      // Sử dụng findAndCount để lấy dữ liệu và tổng số bản ghi
      const result = await queryBuilder.getManyAndCount();

      if (!Array.isArray(result)) {
        throw new Error('findAndCount must return an array');
      }
      const [data, totalCount] = result;

      return result as any;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<Entity>,
    sorts?: FindOptionsOrder<Entity>,
    fields?: (keyof Entity)[],
    currentUser?: JwtAccessPayloadType,
  ): Promise<[Entity[], number]> {
    try {
      const whereConditions: FindOptionsWhere<Entity> = filters || {};
      const orderConditions: FindOptionsOrder<Entity> = sorts || {};

      // if (currentUser?.role.toLocaleLowerCase() !== 'admin') {
      //   whereConditions['id'] = currentUser?.id as any;
      // }

      let options: FindManyOptions<Entity> = {
        where: buildWhereClause(whereConditions),
        order: buildOrderClause(orderConditions as any),
        skip: (page - 1) * limit,
        take: limit,
        select: fields ? (fields as any) : undefined,
      };

      // let options2: FindManyOptions<Entity> = {
      //   where: this.processFilters(whereConditions),
      //   order: this.processSorting(orderConditions),
      //   skip: (page - 1) * limit,
      //   take: limit,
      //   select: fields ? (fields as any) : undefined,
      // };

      options = await this.modifyFindManyOptions(options, currentUser);

      const [data, total] = await this.repository.findAndCount(options);

      return [data, total];
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  protected async modifyFindManyOptions(
    options: FindManyOptions<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<FindManyOptions<Entity>> {
    return options;
  }

  // private processFilters(
  //   filters: FindOptionsWhere<Entity>,
  // ): FindOptionsWhere<Entity> {
  //   const processedFilters: FindOptionsWhere<Entity> = {};

  //   Object.keys(filters).forEach((key) => {
  //     const value = filters[key];
  //     if (!value) return;

  //     if (Array.isArray(value)) {
  //       processedFilters[key] = In(value);
  //     } else if (typeof value === 'string') {
  //       const normalizedValue = value.trim().toLowerCase();
  //       if (normalizedValue.startsWith('like_')) {
  //         processedFilters[key] = Like(
  //           `%${normalizedValue.replace('like_', '').trim()}%`,
  //         );
  //       } else if (/^(>|>=|<|<=|=)_/.test(normalizedValue)) {
  //         const operator = normalizedValue.slice(
  //           0,
  //           normalizedValue.indexOf('_'),
  //         );
  //         const actualValue = normalizedValue
  //           .slice(normalizedValue.indexOf('_') + 1)
  //           .trim();

  //         processedFilters[key] = { [operator]: actualValue } as any;
  //       } else {
  //         processedFilters[key] = value;
  //       }
  //     } else {
  //       processedFilters[key] = IsNull();
  //     }
  //   });

  //   return processedFilters;
  // }
  // private processSorting(
  //   sorts: FindOptionsOrder<Entity>,
  // ): FindOptionsOrder<Entity> {
  //   const processedSorts: FindOptionsOrder<Entity> = {};

  //   Object.entries(sorts || {}).forEach(([key, order]) => {
  //     processedSorts[key] = order.toUpperCase() as 'ASC' | 'DESC';
  //   });

  //   return processedSorts;
  // }
}
