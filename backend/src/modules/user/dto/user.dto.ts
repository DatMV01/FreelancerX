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
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { undefinedTransformer } from 'src/utils/transformers/index.transformer';

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
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  status: StatusDto;

  @AutoMap()
  country?: string;

  @AutoMap()
  avatar?: string;

  @AutoMap()
  phoneNumber?: string;

  @AutoMap(() => FreelancerDto)
  @Expose({ name: 'freelancerProfile' })
  @Transform((params) => undefinedTransformer(params))
  freelancerProfile?: FreelancerDto;

  @AutoMap(() => [OrderDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  buyerorders?: OrderDto[];

  @AutoMap(() => [ReviewDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  reviews?: ReviewDto[];

  @AutoMap(() => [NotificationDto])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  notifications?: NotificationDto[];

  @AutoMap(() => [FileEntity])
  @Transform(({ value, key, obj, type, options }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return value ? value.length : undefined;
    }
  })
  files?: FileEntity[];
}
