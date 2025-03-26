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
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { SessionDto } from 'src/modules/session/dto/session.dto';
import { SessionEntity } from 'src/modules/session/entities/session.entity';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BaseEntity } from 'typeorm';
import { RoleDto } from '../../role/dto/role.dto';
import { RoleEntity } from '../../role/entities/role.entity';
import { CreateFreelancerDto } from 'src/modules/freelancer/dto/create-freelancer.dto';
import { CreateRoleDto } from 'src/modules/role/dto/create-role.dto';
import { UpdateRoleDto } from 'src/modules/role/dto/update-role.dto';
import { CreateStatusDto } from 'src/modules/status/dto/create-status.dto';
import { UpdateStatusDto } from 'src/modules/status/dto/update-status.dto';
import { CreateSessionDto } from 'src/modules/session/dto/create-session.dto';
import { UpdateSessionDto } from 'src/modules/session/dto/update-session.dto';
import {
  CreateGigDto,
  GigFreelancerDto,
} from 'src/modules/gig/dto/create-gig.dto';
import { UpdateGigDto } from 'src/modules/gig/dto/update-gig.dto';
import { CreateOrderDto } from 'src/modules/order/dto/create-order.dto';
import { UpdateOrderDto } from 'src/modules/order/dto/update-order.dto';
import { CreateOrderDetailDto } from 'src/modules/orderdetail/dto/create-orderdetail.dto';
import { UpdateOrderdetailDto } from 'src/modules/orderdetail/dto/update-orderdetail.dto';
import { CreatePaymentDto } from 'src/modules/payment/dto/create-payment.dto';
import { UpdatePaymentDto } from 'src/modules/payment/dto/update-payment.dto';
import { CreateReviewDto } from 'src/modules/review/dto/create-review.dto';
import { UpdateReviewDto } from 'src/modules/review/dto/update-review.dto';
import { CreateCategoryDto } from 'src/modules/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/modules/category/dto/update-category.dto';
import { CreateNotificationDto } from 'src/modules/notification/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/modules/notification/dto/update-notification.dto';
import { CreateRatingDto } from 'src/modules/rating/dto/create-rating.dto';
import { UpdateRatingDto } from 'src/modules/rating/dto/update-rating.dto';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';
import { CreateBaseDto } from '../dto/create-base.dto';
import { UpdateBaseDto } from '../dto/update-base.dto';
import { UpdateFreelancerDto } from 'src/modules/freelancer/dto/update-freelancer.dto';
import { AuthRegisterLoginDto } from 'src/modules/auth/dto/auth-email-register.dto';

@Injectable()
export class AutoMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }
  //   createMap(mapper,,)
  override get profile() {
    return (mapper) => {
      createMap(mapper, RoleEntity, RoleDto);
      createMap(mapper, RoleDto, RoleEntity);
      createMap(mapper, CreateRoleDto, RoleEntity);
      createMap(mapper, UpdateRoleDto, RoleEntity);

      createMap(mapper, StatusEntity, StatusDto);
      createMap(mapper, StatusDto, StatusEntity);
      createMap(mapper, CreateStatusDto, StatusEntity);
      createMap(mapper, UpdateStatusDto, StatusEntity);

      createMap(mapper, SessionEntity, SessionDto);
      createMap(mapper, SessionDto, SessionEntity);
      createMap(mapper, CreateSessionDto, SessionEntity);
      createMap(mapper, UpdateSessionDto, SessionEntity);

      createMap(mapper, GigEntity, GigDto);
      createMap(mapper, GigDto, GigEntity);
      createMap(mapper, CreateGigDto, GigEntity);
      createMap(mapper, UpdateGigDto, GigEntity);

      createMap(mapper, OrderEntity, OrderDto);
      createMap(mapper, OrderDto, OrderEntity);
      createMap(mapper, CreateOrderDto, OrderEntity);
      createMap(mapper, UpdateOrderDto, OrderEntity);

      createMap(mapper, OrderDetailEntity, OrderDetailDto);
      createMap(mapper, OrderDetailDto, OrderDetailEntity);
      createMap(mapper, CreateOrderDetailDto, OrderDetailEntity);
      createMap(mapper, UpdateOrderdetailDto, OrderDetailEntity);

      createMap(mapper, PaymentEntity, PaymentDto);
      createMap(mapper, PaymentDto, PaymentEntity);
      createMap(mapper, CreatePaymentDto, PaymentEntity);
      createMap(mapper, UpdatePaymentDto, PaymentEntity);

      createMap(mapper, ReviewEntity, ReviewDto);
      createMap(mapper, ReviewDto, ReviewEntity);
      createMap(mapper, CreateReviewDto, ReviewEntity);
      createMap(mapper, UpdateReviewDto, ReviewEntity);

      createMap(mapper, CategoryEntity, CategoryDto);
      createMap(mapper, CategoryDto, CategoryEntity);
      createMap(mapper, CreateCategoryDto, CategoryEntity);
      createMap(mapper, UpdateCategoryDto, CategoryEntity);

      createMap(mapper, NotificationEntity, NotificationDto);
      createMap(mapper, NotificationDto, NotificationEntity);
      createMap(mapper, CreateNotificationDto, NotificationEntity);
      createMap(mapper, UpdateNotificationDto, NotificationEntity);

      createMap(mapper, RatingEntity, RatingDto);
      createMap(mapper, RatingDto, RatingEntity);
      createMap(mapper, CreateRatingDto, RatingEntity);
      createMap(mapper, UpdateRatingDto, RatingEntity);

      createMap(mapper, RatingReplyEntity, RatingReplyDto);
      createMap(mapper, RatingReplyDto, RatingReplyEntity);

      createMap(mapper, UserEntity, UserDto);
      createMap(mapper, UserDto, UserEntity);
      createMap(mapper, AuthRegisterLoginDto, UserEntity);
      createMap(mapper, CreateUserDto, UserEntity);
      createMap(mapper, UpdateUserDto, UserEntity);

      createMap(mapper, BaseEntity, BaseDto);
      createMap(mapper, BaseDto, BaseEntity);

      createMap(mapper, GigFreelancerDto, FreelancerDto);
      createMap(mapper, GigFreelancerDto, FreelancerEntity);

      createMap(mapper, FreelancerEntity, FreelancerDto);
      createMap(
        mapper,
        CreateFreelancerDto,
        FreelancerEntity,
        // forMember(
        //   (destination) => destination.userProfile,
        //   mapFrom((source: CreateFreelancerDto) => {
        //     return {
        //       email: source.email,
        //     } as any;
        //   }),
        // ),
      );
      createMap(mapper, UpdateFreelancerDto, FreelancerEntity);
    };
  }
}
