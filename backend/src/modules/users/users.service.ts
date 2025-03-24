import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { NullableType } from 'src/utils/types/nullable.type';
import {
  DeepPartial,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  SortDirection,
} from 'typeorm';
import validator from 'validator';
import { AuthProvidersEnum } from '../auth/enum/auth-providers.enum';
import { FilesLocalService } from '../files/files.service';
import { RoleEntity } from '../roles/entities/role.entity';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEntity } from '../status/entities/status.entity';
import { StatusEnum } from '../status/enum/statuses.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  private static SALT = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly filesService: FilesLocalService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const { identifier, role, status, password, fullName, provider } =
      createUserDto;

    // Validate email
    if (identifier) {
      const userObject = await this.findByEmailOrUsername(
        createUserDto.identifier,
      );
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            identifier: 'EmailOrUsernameAlreadyExists',
          },
        });
      }
    }

    // Validate role
    let validatedRole: Partial<RoleEntity> | undefined;
    if (role?.id) {
      if (!Object.values(RoleEnum).map(String).includes(String(role.id))) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { role: 'roleNotExists' },
        });
      }
      validatedRole = { id: Number(role.id) };
    }

    // Validate status
    let validatedStatus: Partial<StatusEntity> | undefined;
    if (status?.id) {
      if (!Object.values(StatusEnum).map(String).includes(String(status.id))) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: { status: 'statusNotExists' },
        });
      }
      validatedStatus = { id: Number(status.id) };
    }

    // Hash password
    const hashedPassword = password
      ? await bcrypt.hash(password, UsersService.SALT)
      : undefined;

    let avatar: string | undefined | null = createUserDto.avatar;

    const isEmail = validator.isEmail(identifier || '');

    const entity: DeepPartial<UserEntity> = {
      fullName,
      email: isEmail ? identifier : undefined,
      username: !isEmail ? identifier : undefined,
      password: hashedPassword,
      avatar,
      role: validatedRole,
      status: validatedStatus,
      provider: provider ?? AuthProvidersEnum.email,
      // socialId,
    };

    // Create user entity
    const createdUser = this.usersRepository.create(entity);
    await this.usersRepository.save(createdUser);

    return UserMapper.toDomain(createdUser as any);
  }

  async findByEmailOrUsername(
    identifier: UserDto['identifier'],
  ): Promise<NullableType<UserDto>> {
    if (!identifier) return null;

    const entity = await this.usersRepository.findOne({
      where: [{ email: identifier }, { username: identifier }],
    });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findManyWithPagination(
    query: QueryUserDto,
  ): Promise<[UserDto[], number]> {
    const { page, limit, status, roles, sort } = query;

    const where: FindOptionsWhere<UserEntity> = {
      ...(roles?.length && {
        role: roles
          .filter((_) => _ !== '')
          .map((_) => ({
            id: RoleEnum[_.toUpperCase().trim()],
          })),
      }),
      ...(status?.length && {
        status: status
          .filter((_) => _ !== '')
          .map((_) => ({
            id: StatusEnum[_.toUpperCase().trim()],
          })),
      }),
    };

    // // Build 'order' clause dynamically
    const order = Object.fromEntries(
      (sort || []).map((fieldPair) => {
        const [orderBy, direction] = fieldPair.split(',');
        return [orderBy.trim(), direction as SortDirection];
      }),
    );

    const [entities, count] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      where,
      order,
    });

    const domains = entities.map((user) => UserMapper.toDomain(user));

    return [domains, count];
  }

  async findOne(
    options: FindOneOptions<UserEntity>,
  ): Promise<NullableType<UserEntity>> {
    return this.usersRepository.findOne(options);
  }

  // haz i can understant all of what u say. but i can not speak fluentcy like u

  async findById(id: UserDto['id']): Promise<NullableType<UserDto>> {
    const entity = await this.usersRepository.findOneBy({ id });

    return entity ? UserMapper.toDomain(entity) : null;
  }

  async update(
    id: UserDto['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<UserDto | null> {
    const userEntity = await this.usersRepository.findOne({
      where: { id: String(id) },
    });

    if (!userEntity) {
      throw new NotFoundException('User not found');
    }

    const password = await this.hashPasswordIfNeeded(
      userEntity,
      updateUserDto.password,
    );

    const identifier = await this.validateAndResolveEmailOrUsername(
      id,
      updateUserDto.identifier,
    );

    const {
      // firstName,
      // lastName,
      fullName,
      status,
      provider,
      socialId,
      role,
    } = updateUserDto;

    const isEmail = validator.isEmail(identifier || '');

    const updateResult = this.usersRepository.update(id, {
      // firstName,
      // lastName,
      fullName,
      email: isEmail ? identifier : undefined,
      username: !isEmail ? identifier : undefined,
      password: password,
      avatar: updateUserDto.avatar,
      role: {
        id: role?.id,
      } as any,
      status: {
        id: status?.id,
      } as any,
      provider,
      // socialId,
    });

    return updateResult as any;
  }

  private async hashPasswordIfNeeded(
    user: UserEntity,
    newPassword?: string,
  ): Promise<string | undefined> {
    if (newPassword) {
      return user.password &&
        newPassword &&
        bcrypt.compareSync(newPassword, user.password)
        ? bcrypt.hashSync(newPassword, UsersService.SALT)
        : undefined;
    }

    return undefined;
  }

  private async validateAndResolveEmailOrUsername(
    userId: UserDto['id'],
    identifier?: string | null,
  ): Promise<string | undefined> {
    if (identifier === undefined || identifier === null) return undefined;

    // if (email === null) return null;

    const existingUser = await this.findByEmailOrUsername(identifier);

    if (existingUser && existingUser.id !== userId) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: { identifier: 'has already existed' },
      });
    }

    return identifier;
  }

  async delete(userId: string): Promise<boolean> {
    const result = await this.usersRepository.softDelete(userId);
    return (result.affected || 0) > 0;
  }
}
