import { AutoMap } from '@automapper/classes';
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
  description?: string;

  @AutoMap()
  skills?: string[];

  @AutoMap()
  languages?: string[];

  @AutoMap()
  rating: number;

  @AutoMap()
  completedOrders: number;

  @AutoMap()
  responseTime?: number;

  @AutoMap()
  availability: 'available' | 'busy' | 'offline';

  @AutoMap()
  earnings: number;

  @AutoMap()
  withdrawnAmount: number;

  @AutoMap(() => [GigDto])
  gigs: GigDto[];

  @AutoMap(() => [OrderDto])
  sellerOrders: OrderDto[];
}
