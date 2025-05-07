import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { BaseService } from '../base/base.service';
import { BaseEntity } from '../base/entities/base.entity';
import { UserEntity } from './entities/user.entity';
import { WalletEntity } from '../wallet/entities/wallet.entity';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,

    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
  ) {
    super(_repository);
  }

  private static SALT = 10;

  async create(createDto: DeepPartial<UserEntity>): Promise<UserEntity> {
    const { email, password } = createDto;

    const isExisted = await super.existsBy({ email });

    if (isExisted) {
      throw new UnprocessableEntityException('Email is already existed');
    }

    // Hash password
    createDto.password =
      password && (await bcrypt.hash(password, UserService.SALT));

    const userEntity = await super.create(createDto);

    if (userEntity) {
      await this.walletRepo.save({
        user: userEntity,
      });
    }

    return userEntity;
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<UserEntity>,
  ): Promise<UserEntity> {
    const userEntity = await this.findOne({
      where: { id: String(id) },
    });

    userEntity.password = this.hashPasswordIfNeeded({
      oldHashPassword: userEntity.password,
      newPassword: data.password || '',
    });

    return await super.update(id, data);
  }

  private hashPasswordIfNeeded({
    oldHashPassword,
    newPassword,
  }: {
    oldHashPassword: string;
    newPassword: string;
  }): string {
    const isEqual = bcrypt.compareSync(newPassword, oldHashPassword);

    if (isEqual) {
      return oldHashPassword;
    }

    return bcrypt.hashSync(newPassword, UserService.SALT);
  }

  public async getUserBriefInfo({
    email,
    id,
  }: {
    email?: string;
    id?: string;
  }) {
    const queryBuilder = this.getQueryBuilder();

    const entity = await queryBuilder

      .leftJoin(`${queryBuilder.alias}.freelancer`, 'freelancer')
      .addSelect([
        'freelancer.id',
        'freelancer.displayName',
        'freelancer.level',
      ])

      .leftJoin(`${queryBuilder.alias}.status`, 'status')
      .addSelect(['status.id', 'status.name', 'status.description'])

      .leftJoin(`${queryBuilder.alias}.role`, 'role')
      .addSelect(['role.id', 'role.name', 'status.description'])

      .where(`${queryBuilder.alias}.email= :email `, { email })
      .orWhere(`${queryBuilder.alias}.id= :id`, { id })

      .getOne();

    return entity;
  }

  protected additionalQuery(
    queryBuilder: SelectQueryBuilder<UserEntity>,
    appliedFilters: Set<string>,
    filters: any,
    sort: any,
    currentUser: any,
  ): SelectQueryBuilder<UserEntity> {
    queryBuilder.leftJoinAndSelect(
      `${queryBuilder.alias}.freelancer`,
      'freelancer',
    );

    return queryBuilder;
  }
}
