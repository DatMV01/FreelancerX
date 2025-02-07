import { RoleEnum } from 'src/modules/roles/roles.enum';
import { UserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { StatusEnum } from 'src/modules/status/enum/statuses.enum';
import { FileMapper } from 'src/modules/files/mappers/file.mapper';

export class UserMapper {
  static toDomain(raw: UserEntity): UserDto {
    const domain = new UserDto({
      ...raw,
      role: {
        id: String(raw.role?.id),
        name: RoleEnum[Number(raw.role?.id)],
      } as any,
      status: {
        id: Number(raw.status?.id),
        name: StatusEnum[Number(raw.status?.id)],
      } as any,
      photo: raw.photo && FileMapper.toDomain(raw.photo),
    });

    return domain;
  }

  static toPersistence(domainEntity: UserDto): UserEntity {
    const persistenceEntity: UserEntity = {
      ...domainEntity,

      role: domainEntity.role
        ? ({ id: Number(domainEntity.role.id) } as any)
        : undefined,

      status: domainEntity.status
        ? ({ id: Number(domainEntity.status.id) } as any)
        : undefined,

      photo: domainEntity.photo && FileMapper.toPersistence(domainEntity.photo),
      gigs: [],
      orders: [],
      sellerOrders: [],
      reviews: [],
      notifications: [],
    };
    return persistenceEntity;
  }
}
