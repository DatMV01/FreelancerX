import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { MaybeUndefined } from 'src/utils/types/maybe.type';
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
  QueryFailedError,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseEntity } from './entities/base.entity';
import { throwUnprocessableEntityException } from 'src/common/exception/thowException';
import { consoleError } from 'src/utils/common';

@Injectable()
export abstract class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  @Inject(DataSource) protected readonly dataSource: DataSource;

  // CREATE
  async create(createDto: DeepPartial<Entity>): Promise<Entity> {
    try {
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Error creating entity:', error);
      throw new UnprocessableEntityException('Could not create entity');
    }
  }

  // READ (Find All with Pagination)
  async findAll2(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<Entity>,
    sorts?: FindOptionsOrder<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<[Entity[], number]> {
    const appliedFilters = new Set<string>();

    const queryBuilder = this.additionalQuery(
      this.repository.createQueryBuilder() as SelectQueryBuilder<Entity>,
      appliedFilters,
      filters,
      sorts,
      currentUser,
    );

    this.applyFilters(queryBuilder, filters, appliedFilters);
    this.applySorting(queryBuilder, sorts, appliedFilters);

    queryBuilder.skip((page - 1) * limit).take(limit);
    return queryBuilder.getManyAndCount();
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Entity>,
    filters?: FindOptionsWhere<Entity>,
    appliedFilters?: Set<string>,
  ) {
    if (!filters) return;

    Object.keys(filters).forEach((key) => {
      if (appliedFilters?.has(key)) return;
      const value = filters[key];
      if (!value) return;

      if (Array.isArray(value)) {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} IN (:...${key})`, {
          [key]: value,
        });
      } else if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue.startsWith('like_')) {
          queryBuilder.andWhere(`${queryBuilder.alias}.${key} LIKE :${key}`, {
            [key]: `%${normalizedValue.replace('like_', '').trim()}%`,
          });
        } else if (/^(>|>=|<|<=|=)_/.test(normalizedValue)) {
          const operator = normalizedValue.slice(
            0,
            normalizedValue.indexOf('_'),
          );

          const actualValue = normalizedValue
            .slice(normalizedValue.indexOf('_') + 1)
            .trim();

          queryBuilder.andWhere(
            `${queryBuilder.alias}.${key} ${operator} :${key}`,
            {
              [key]: actualValue,
            },
          );
        } else {
          queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
            [key]: value,
          });
        }
      } else {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} IS NULL`);
      }

      appliedFilters?.add(key);
    });
  }

  private applySorting(
    queryBuilder: SelectQueryBuilder<Entity>,
    sorts?: FindOptionsOrder<Entity>,
    appliedFilters?: Set<string>,
  ) {
    if (!sorts) return;
    Object.entries(sorts || {}).forEach(([key, order]) => {
      if (appliedFilters?.has(key)) return;
      queryBuilder.addOrderBy(
        `${queryBuilder.alias}.${key}`,
        sorts[key].toUpperCase(),
      );
      appliedFilters?.add(key);
    });
  }

  // READ (Find One by ID)
  async findOneById(id: BaseEntity['id']): Promise<Entity> {
    const entity = await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
    });

    if (!entity) {
      consoleError(`Entity with ID ${id} not found`);
      throw new NotFoundException(`ID ${id} not found`);
    }

    return entity;
  }

  async findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    const entity = await this.repository.findOne(options);

    if (!entity) {
      consoleError(
        `Entity with options:  ${JSON.stringify(options)} not found`,
      );
      throw new NotFoundException(
        `Entity with: ${JSON.stringify(options)} not found`,
      );
    }
    return entity;
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<Entity>,
  ): Promise<Entity> {
    const entity = await this.repository.preload({ id, ...data });

    if (!entity) {
      consoleError(`Entity with ID ${id} not found`);
      throw new NotFoundException(`ID ${id} not found`);
    }

    try {
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw new ConflictException('Update failed due to conflict');
    }
  }

  async updateOnly(
    id: BaseEntity['id'],
    entity: DeepPartial<Entity>,
  ): Promise<Entity> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw new ConflictException('Update failed due to conflict');
    }
  }

  // DELETE (Soft Delete)
  async removeOneById(id: BaseEntity['id']): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    if (!result.affected) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return true;
  }

  async removeHardOneById(id: BaseEntity['id']): Promise<boolean> {
    const result = await this.repository.delete(id);
    if (!result.affected) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return true;
  }

  async remove(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const result = await this.repository.softDelete(where);
    if (!result.affected)
      throw new NotFoundException(`Entity with condition not found`);

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

  async getSelectedFields(
    //repository: Repository<Entity>,
    fields: (keyof Entity)[],
    where?: Partial<Entity>,
  ): Promise<Partial<Entity>[]> {
    const queryBuilder: SelectQueryBuilder<Entity> =
      this.repository.createQueryBuilder();

    queryBuilder.select(
      fields.map((field) => `${queryBuilder.alias}.${String(field)}`),
    );

    if (where) {
      Object.entries(where).forEach(([key, value]) => {
        queryBuilder.andWhere(`${queryBuilder.alias}.${key} = :${key}`, {
          [key]: value,
        });
      });
    }

    return queryBuilder.getRawMany();
  }

  /*===*/

  async findAllOld(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<Entity>,
    sorts?: FindOptionsOrder<Entity>,
    currentUser?: JwtAccessPayloadType,
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

  /* ================== */

  async findAll(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<Entity>,
    sorts?: FindOptionsOrder<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<[Entity[], number]> {
    try {
      const whereConditions: FindOptionsWhere<Entity> = filters || {};
      const orderConditions: FindOptionsOrder<Entity> = sorts || {};

      // if (currentUser?.role !== 'admin') {
      //   whereConditions['id']  = currentUser?.id as any;
      // }

      let options: FindManyOptions<Entity> = {
        where: this.processFilters(whereConditions),
        order: this.processSorting(orderConditions),
        skip: (page - 1) * limit,
        take: limit,
        //   relations: ['relatedEntities'],
      };

      options = this.modifyOptions(options, currentUser);

      const [data, total] = await this.repository.findAndCount(options);

      return [data, total];
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  protected modifyOptions(
    options: FindManyOptions<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): FindManyOptions<Entity> {
    // if (currentUser?.role === 'manager') {
    //   options.where = { ...options.where, status: 'active' };
    // }
    return options;
  }

  private processFilters(
    filters: FindOptionsWhere<Entity>,
  ): FindOptionsWhere<Entity> {
    const processedFilters: FindOptionsWhere<Entity> = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (!value) return;

      if (Array.isArray(value)) {
        processedFilters[key] = In(value);
      } else if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue.startsWith('like_')) {
          processedFilters[key] = Like(
            `%${normalizedValue.replace('like_', '').trim()}%`,
          );
        } else if (/^(>|>=|<|<=|=)_/.test(normalizedValue)) {
          const operator = normalizedValue.slice(
            0,
            normalizedValue.indexOf('_'),
          );
          const actualValue = normalizedValue
            .slice(normalizedValue.indexOf('_') + 1)
            .trim();

          processedFilters[key] = { [operator]: actualValue } as any;
        } else {
          processedFilters[key] = value;
        }
      } else {
        processedFilters[key] = IsNull();
      }
    });

    return processedFilters;
  }
  private processSorting(
    sorts: FindOptionsOrder<Entity>,
  ): FindOptionsOrder<Entity> {
    const processedSorts: FindOptionsOrder<Entity> = {};

    Object.entries(sorts || {}).forEach(([key, order]) => {
      processedSorts[key] = order.toUpperCase() as 'ASC' | 'DESC';
    });

    return processedSorts;
  }
}
