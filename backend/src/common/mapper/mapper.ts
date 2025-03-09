import { Mapper, createMap } from '@automapper/core';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { RoleDto } from '../../modules/roles/dto/role.dto';
import { RoleEntity } from '../../modules/roles/entities/role.entity';
import { StatusEntity } from 'src/modules/status/entities/status.entity';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { SessionEntity } from 'src/modules/session/entities/session.entity';
import { SessionDto } from 'src/modules/session/dto/session.dto';
import { CategoryDto } from 'src/modules/category/dto/category.dto';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { OrderDetailEntity } from 'src/modules/orderdetail/entities/orderdetail.entity';
import { OrderDetailDto } from 'src/modules/orderdetail/dto/orderdetail.dto';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { PaymentDto } from 'src/modules/payment/dto/payment.dto';
import { ReviewEntity } from 'src/modules/review/entities/review.entity';
import { ReviewDto } from 'src/modules/review/dto/review.dto';
import { NotificationEntity } from 'src/modules/notification/entities/notification.entity';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { RatingReplyEntity } from 'src/modules/rating/entities/rating-reply.entity';
import { RatingReplyDto } from 'src/modules/rating/dto/rating-reply.dto';

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

      createMap(mapper, GigEntity, GigDto);
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
    };
  }
}
