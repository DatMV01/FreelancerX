import { Mapper, createMap, forMember, mapFrom } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderDetailDto } from 'src/modules/orderdetail/dto/orderdetail.dto';
import { OrderDetailEntity } from 'src/modules/orderdetail/entities/orderdetail.entity';
import { PaymentDto } from 'src/modules/payment/dto/payment.dto';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { RatingReplyDto } from 'src/modules/rating/dto/rating-reply.dto';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { RatingReplyEntity } from 'src/modules/rating/entities/rating-reply.entity';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { ReviewDto } from 'src/modules/review/dto/review.dto';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { SellerDto } from 'src/modules/seller/dto/seller.dto';
import { SellerEntity } from 'src/modules/seller/entities/seller.entity';
import { SessionDto } from 'src/modules/session/dto/session.dto';
import { SessionEntity } from 'src/modules/session/entities/session.entity';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'typeorm';
import { RoleDto } from '../../roles/dto/role.dto';
import { RoleEntity } from '../../roles/entities/role.entity';

@Injectable()
export class AutoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, RoleEntity, RoleDto);
      createMap(mapper, RoleDto, RoleEntity);

      createMap(mapper, StatusEntity, StatusDto);
      createMap(mapper, StatusDto, StatusEntity);

      createMap(mapper, SessionEntity, SessionDto);
      createMap(mapper, SessionDto, SessionEntity);

      createMap(
        mapper,
        GigEntity,
        GigDto,
        forMember(
          (destination) => destination.seller,
          mapFrom((source) => {
            // return {
            //   ...source.seller,
            //   ...source.seller.user,
            //   user: undefined,
            // }  ;
            return new SellerDto({
              ...source.seller,
              ...source.seller.user,
              user: undefined,
            } as any);
          }),
        ),
      );
      createMap(mapper, GigDto, GigEntity);

      createMap(mapper, OrderEntity, OrderDto);
      createMap(mapper, OrderDto, OrderEntity);

      createMap(mapper, OrderDetailEntity, OrderDetailDto);
      createMap(mapper, OrderDetailDto, OrderDetailEntity);

      createMap(mapper, PaymentEntity, PaymentDto);
      createMap(mapper, PaymentDto, PaymentEntity);

      createMap(mapper, ReviewEntity, ReviewDto);
      createMap(mapper, ReviewDto, ReviewEntity);

      createMap(mapper, CategoryEntity, CategoryDto);
      createMap(mapper, CategoryDto, CategoryEntity);

      createMap(mapper, NotificationEntity, NotificationDto);
      createMap(mapper, NotificationDto, NotificationEntity);

      createMap(mapper, RatingEntity, RatingDto);
      createMap(mapper, RatingDto, RatingEntity);

      createMap(mapper, RatingReplyEntity, RatingReplyDto);
      createMap(mapper, RatingReplyDto, RatingReplyEntity);

      createMap(mapper, UserEntity, UserDto);
      createMap(mapper, UserDto, UserEntity);

      createMap(mapper, BaseEntity, BaseDto);
      createMap(mapper, BaseDto, BaseEntity);

      createMap(
        mapper,
        GigEntity,
        GigDto,
        // forMember(
        //   (destination) => destination.tags,
        //   mapFrom((source) => source.tags || []),
        // ),
      );

      createMap(
        mapper,
        GigDto,
        GigEntity,
        // forMember(
        //   (destination) => destination.tags,
        //   mapFrom((source) => source.tags || []),
        // ),
      );

      createMap(
        mapper,
        SellerEntity,
        SellerDto,

        // forMember(
        //   (destination) => destination.user,
        //   mapFrom((source: any) => new UserDto({ ...source.user })),
        // ),
      );
      createMap(mapper, SellerDto, SellerEntity);
    };
  }
}
