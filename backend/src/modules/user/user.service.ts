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

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _repository: Repository<UserEntity>,
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

    return super.create(createDto);
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
