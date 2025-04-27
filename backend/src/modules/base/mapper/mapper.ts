import {
  Mapper,
  afterMap,
  beforeMap,
  createMap,
  forMember,
  forSelf,
  mapWith,
} from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { AuthRegisterLoginDto } from 'src/modules/auth/dto/auth-email-register.dto';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/category/dto/update-category.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import {
  CreateFreelancerDto,
  LanguageDto,
  SkillDto,
} from 'src/modules/freelancer/dto/create-freelancer.dto';
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { UpdateFreelancerDto } from 'src/modules/freelancer/dto/update-freelancer.dto';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  CreateGigDto,
  GigFreelancerDto,
} from 'src/modules/gig/dto/create-gig.dto';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { UpdateGigDto } from 'src/modules/gig/dto/update-gig.dto';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { UpdateNotificationDto } from 'src/modules/notification/dto/update-notification.dto';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { CreateOrderDto } from 'src/modules/order/dto/create-order.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { UpdateOrderDto } from 'src/modules/order/dto/update-order.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';
import { UpdateRoleDto } from 'src/modules/role/dto/update-role.dto';
import { CreateSessionDto } from 'src/modules/session/dto/create-session.dto';
import { SessionDto } from 'src/modules/session/dto/session.dto';
import { UpdateSessionDto } from 'src/modules/session/dto/update-session.dto';
import { SessionEntity } from 'src/modules/session/entities/session.entity';
import { CreateStatusDto } from 'src/modules/status/dto/create-status.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { UpdateStatusDto } from 'src/modules/status/dto/update-status.dto';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { CreateTransactionDto } from 'src/modules/transaction/dto/create-transaction.dto';
import { TransactionDto } from 'src/modules/transaction/dto/transaction.dto';
import { UpdateTransactionDto } from 'src/modules/transaction/dto/update-transaction.dto';
import { OrderTransactionEntity } from 'src/modules/transaction/entities/order_transactions.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'typeorm';
import { RoleDto } from '../../role/dto/role.dto';
import { RoleEntity } from '../../role/entities/role.entity';
import {
  convertNullToUndefined,
  removeUndefinedFields,
} from 'src/utils/common';
import { SkillEntity } from 'src/modules/freelancer/entities/freelancer_skills.entity';
import { LanguageEntity } from 'src/modules/freelancer/entities/freelancer_languages.entity';

@Injectable()
export class AutoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper): void => {
      createMap<BaseEntity, BaseDto<any>>(mapper, BaseEntity, BaseDto<any>);
      createMap<BaseDto<any>, BaseEntity>(mapper, BaseDto<any>, BaseEntity);

      const mappings = [
        {
          entity: RoleEntity,
          dto: RoleDto,
          createDto: CreateRoleDto,
          updateDto: UpdateRoleDto,
          isMappingCreateDto: true,
        },
        {
          entity: StatusEntity,
          dto: StatusDto,
          createDto: CreateStatusDto,
          updateDto: UpdateStatusDto,
        },
        {
          entity: SessionEntity,
          dto: SessionDto,
          createDto: CreateSessionDto,
          updateDto: UpdateSessionDto,
        },
        {
          entity: GigEntity,
          dto: GigDto,
          createDto: CreateGigDto,
          updateDto: UpdateGigDto,
          isMappingCreateDto: true,
        },
        {
          entity: OrderEntity,
          dto: OrderDto,
          createDto: CreateOrderDto,
          updateDto: UpdateOrderDto,
        },
        {
          entity: OrderTransactionEntity,
          dto: TransactionDto,
          createDto: CreateTransactionDto,
          updateDto: UpdateTransactionDto,
        },

        {
          entity: CategoryEntity,
          dto: CategoryDto,
          createDto: CreateCategoryDto,
          updateDto: UpdateCategoryDto,
        },
        {
          entity: NotificationEntity,
          dto: NotificationDto,
          createDto: CreateNotificationDto,
          updateDto: UpdateNotificationDto,
        },

        {
          entity: UserEntity,
          dto: UserDto,
          createDto: CreateUserDto,
          updateDto: UpdateUserDto,
        },
        {
          entity: FreelancerEntity,
          dto: FreelancerDto,
          createDto: CreateFreelancerDto,
          updateDto: UpdateFreelancerDto,
          isMappingCreateDto: true,
        },
        {
          entity: UserEntity,
          dto: AuthRegisterLoginDto,
          createDto: AuthRegisterLoginDto,
          updateDto: AuthRegisterLoginDto,
        },
        {
          entity: SkillEntity,
          dto: SkillDto,
          createDto: SkillDto,
          updateDto: SkillDto,
        },
        {
          entity: LanguageEntity,
          dto: LanguageDto,
          createDto: LanguageDto,
          updateDto: LanguageDto,
        },
      ];
      mappings.forEach(
        ({ entity, dto, createDto, updateDto, isMappingCreateDto }) => {
          createMap(
            mapper,
            entity as any,
            dto as any,
            beforeMap((source, destination) => {
              //     return convertNullToUndefined(source);
            }),

            afterMap((source, destination) => {
              Object.assign(destination, convertNullToUndefined(destination));

              //   console.log(destination);
            }),
          );

          createMap(mapper, dto as any, entity as any);
          const createMapping = createMap(
            mapper,
            createDto as any,
            entity as any,
          );

          if (isMappingCreateDto) {
            createMap(
              mapper,
              updateDto,
              entity as any,
              forSelf(createMapping, (source) => source),
            );
          } else {
            createMap(mapper, updateDto as any, entity as any);
          }
        },
      );
    };
  }
}
