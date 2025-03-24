import { AutoMap } from '@automapper/classes';
import { Expose } from 'class-transformer';
import { ADMIN_GROUP, ME_GROUP } from 'src/common/constant/serialize.group';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { GigDto } from 'src/modules/gig/dto/gig.dto';
import { OrderDto } from 'src/modules/order/dto/order.dto';
import { UserDto } from 'src/modules/users/dto/user.dto';

export class SellerDto extends BaseDto<SellerDto> {
  @AutoMap()
  id: string;

  @AutoMap(() => UserDto)
  user?: UserDto;

  @AutoMap()
  sellerLevel: 'new' | 'level1' | 'level2' | 'level3';

  @AutoMap()
  about?: string;

  @AutoMap(() => [String])
  skills?: string[];

  @AutoMap(() => [String])
  languages?: string[];

  @AutoMap()
  rating: number;

  @AutoMap()
  reviewCount: number;

  @AutoMap()
  completedOrders: number;

  @AutoMap()
  responseTime?: number;

  @AutoMap()
  availability: 'available' | 'busy' | 'offline';

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  earnings: number;

  @AutoMap()
  @Expose({ groups: [ADMIN_GROUP, ME_GROUP], toPlainOnly: true })
  withdrawnAmount: number;

  @AutoMap(() => [GigDto])
  gigs: GigDto[];

  @AutoMap(() => [OrderDto])
  sellerOrders: OrderDto[];
}
