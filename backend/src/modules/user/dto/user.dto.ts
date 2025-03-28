import { AutoMap } from '@automapper/classes';
import {
  Exclude,
  Expose,
  Transform
} from 'class-transformer';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FileEntity } from 'src/modules/files/entities/file.entity';
import { FreelancerDto } from 'src/modules/freelancer/dto/freelancer.dto';
import { NotificationDto } from 'src/modules/notification/dto/notification.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { RatingDto } from 'src/modules/rating/dto/rating.dto';
import { RatingEntity } from 'src/modules/rating/entities/rating.entity';
import { RoleDto } from 'src/modules/role/dto/role.dto';
import { StatusDto } from 'src/modules/status/dto/status.dto';
import { TransactionDto } from 'src/modules/transaction/dto/transaction.dto';
import { undefinedTransformer } from 'src/utils/transformers/index.transformer';
import { AuthProvidersEnum } from '../enum/user.provider';

export class UserDto extends BaseDto<UserDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  email: string;

  @AutoMap()
  @Exclude()
  password: string;

  @AutoMap()
  provider?: AuthProvidersEnum = AuthProvidersEnum.EMAIL;

  @AutoMap()
  fullName: string;

  @AutoMap()
  country?: string | null;

  @AutoMap()
  avatar?: string | null;

  @AutoMap()
  phoneNumber?: string | null;

  @AutoMap(() => RoleDto)
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  role: RoleDto;

  @AutoMap(() => StatusDto)
  @Transform((params) => undefinedTransformer(params, ['id', 'name']))
  status: StatusDto;

  @AutoMap(() => FreelancerDto)
  @Expose({ name: 'freelancer' })
  @Transform((params) => undefinedTransformer(params))
  freelancer?: FreelancerDto | null;

  /* ORDERS */
  @AutoMap(() => [OrderDto])
  @Exclude()
  @Transform((params) => undefinedTransformer(params))
  buyerorders?: OrderDto[] | null;

  /* RATINGS */
  @AutoMap(() => [RatingEntity])
  @Exclude()
  @Transform((params) => undefinedTransformer(params))
  ratings: RatingDto[];

  /* NOTIFICATIONS */
  @AutoMap(() => [NotificationDto])
  @Exclude()
  @Transform((params) => undefinedTransformer(params))
  notifications?: NotificationDto[];

  /* FILES */

  @AutoMap(() => [FileEntity])
  @Exclude()
  @Transform((params) => undefinedTransformer(params))
  files?: FileEntity[];

  /* TRANSACTIONS */
  @AutoMap(() => [TransactionDto])
  @Exclude()
  @Transform((params) => undefinedTransformer(params))
  transactions: TransactionDto[];
}
