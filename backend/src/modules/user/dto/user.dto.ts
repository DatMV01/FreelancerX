import { AutoMap } from '@automapper/classes';
import {
  Exclude,
  Expose,
  Transform,
  TransformationType,
} from 'class-transformer';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { ReviewDto } from 'src/modules/review/dto/review.dto';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { SellerDto } from 'src/modules/seller/dto/seller.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';

export class UserDto extends BaseDto<UserDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  @Exclude()
  password: string;

  @AutoMap()
  provider: string;

  @AutoMap()
  fullName: string;

  @AutoMap(() => RoleDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value?.name;
    }
  })
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value?.name;
    }
  })
  status: StatusDto;

  @AutoMap()
  country?: string | undefined;

  @AutoMap()
  avatar?: string | undefined;

  @AutoMap()
  phoneNumber?: string | undefined;

  @AutoMap(() => SellerDto)
  @Expose({ name: 'freelancer' })
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value : undefined;
    }
  })
  sellerProfile?: SellerDto | undefined;

  @AutoMap(() => [OrderDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  buyerorders?: OrderDto[] | undefined;

  @AutoMap(() => [ReviewDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  reviews?: ReviewDto[] | undefined;

  @AutoMap(() => [NotificationDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  notifications?: NotificationDto[] | undefined;

  @AutoMap(() => [FileEntity])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  files?: FileEntity[] | undefined;
}
