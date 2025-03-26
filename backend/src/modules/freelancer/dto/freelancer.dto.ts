import { AutoMap } from '@automapper/classes';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { UserDto } from 'src/modules/user/dto/user.dto';
import { undefinedTransformer } from 'src/utils/transformers/index.transformer';
import { FreelancerRankEnum } from '../enum/freelancerRank.enum';

export class FreelancerDto extends BaseDto<FreelancerDto> {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  @Exclude()
  userProfile: UserDto;

  @AutoMap()
  email: string;

  @AutoMap()
  level: FreelancerRankEnum;

  @AutoMap()
  about?: string;

  @AutoMap(() => [String])
  @Transform((params) => undefinedTransformer(params))
  skills?: string[];

  @AutoMap(() => [String])
  @Transform((params) => undefinedTransformer(params))
  languages?: string[];

  @AutoMap()
  rating: number;

  @AutoMap()
  reviewCount: number;

  @AutoMap()
  completedOrders: number;

  @AutoMap()
  @Transform((params) => undefinedTransformer(params))
  responseTime?: number;

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  earnings: number;

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  withdrawnAmount: number;

  @AutoMap(() => [GigDto])
  gigs: GigDto[];

  @AutoMap(() => [OrderDto])
  orders: OrderDto[];
}
