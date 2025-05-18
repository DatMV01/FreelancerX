import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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
  FindOptionsWhere,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseEntity } from './entities/base.entity';
import { CurrentUser } from 'src/common/decorators';

@Injectable()
export abstract class BaseService<Entity extends BaseEntity> {
  constructor(private readonly repository: Repository<Entity>) {}

  @Inject(DataSource) protected readonly dataSource: DataSource;

  async create(
    createDto: DeepPartial<Entity>,
    currentUser: JwtAccessPayloadType,
  ): Promise<Entity> {
    const entity = this.repository.create(createDto);
    return await this.repository.save(entity);
  }

  async findOneById(
    id: BaseEntity['id'],
    currentUser?: JwtAccessPayloadType,
  ): Promise<Entity> {
    return this.findOne({
      where: { id } as any,
    });
  }

  async findOne(
    options: FindOneOptions<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<Entity> {
    const entity = await this.repository.findOne(options);
    if (!entity) throw new NotFoundException('Entity not found');

    return entity;
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<Entity>,
    currentUser: JwtAccessPayloadType,
  ): Promise<Entity> {
    const entity = await this.findOneById(id);
    const updated = Object.assign(entity, data);
    return this.repository.save(updated);
  }

  // DELETE (Soft Delete)
  async removeSoftOneById(
    id: BaseEntity['id'],
    currentUser?: JwtAccessPayloadType,
  ): Promise<boolean> {
    return this.removeSoft({ id } as any);
  }

  async removeHardOneById(
    id: BaseEntity['id'],
    currentUser?: JwtAccessPayloadType,
  ): Promise<boolean> {
    return this.removeHard({ id } as any);
  }

  async removeSoft(
    where: FindOptionsWhere<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<boolean> {
    const result = await this.repository.softDelete(where);

    if (!result.affected)
      throw new NotFoundException('Entity not found or already deleted');

    return true;
  }

  async removeHard(
    where: FindOptionsWhere<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<boolean> {
    const result = await this.repository.delete(where);

    if (!result.affected)
      throw new NotFoundException('Entity not found or already deleted');

    return true;
  }

  // RESTORE (Restore soft deleted entity)
  async restore(id: number, currentUser?: JwtAccessPayloadType): Promise<void> {
    const result = await this.repository.restore(id);
    if (!result.affected)
      throw new NotFoundException(`Entity with ID ${id} not found`);
  }

  async existsByAndThrowExeption(
    where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    currentUser?: JwtAccessPayloadType,
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
    currentUser?: JwtAccessPayloadType,
  ): Promise<boolean> {
    return await this.repository.existsBy(where);
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<Entity>,
    appliedFilters: Set<string>,
    filters: any,
    sort: any,
    currentUser?: JwtAccessPayloadType,
  ): SelectQueryBuilder<Entity> {
    return queryBuilder;
  }

  public getQueryBuilder(): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder();
  }

  public createQueryBuilder(alias: string): SelectQueryBuilder<Entity> {
    return this.repository.createQueryBuilder(alias);
  }

  async findAll(
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

  protected async modifyFindManyOptions(
    options: FindManyOptions<Entity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<FindManyOptions<Entity>> {
    return options;
  }
}
