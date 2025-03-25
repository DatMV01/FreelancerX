import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { throwUnprocessableEntityException } from 'src/common/exception/thowException';
import { DeepPartial, Repository } from 'typeorm';
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

    const entity = email && (await this.exists({ where: { email } }));

    entity &&
      throwUnprocessableEntityException({
        email: 'AlreadyExists',
      });

    // Hash password
    createDto.password =
      password && (await bcrypt.hash(password, UserService.SALT));

    return await super.create(createDto);
  }

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<UserEntity>,
  ): Promise<UserEntity | undefined> {
    const userEntity = await this.findOne({
      where: { id: String(id) },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

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
}
