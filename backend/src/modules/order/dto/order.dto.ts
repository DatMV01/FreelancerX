import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OrderStatus } from '../entities/order.entity';
import { OrderLogEntity } from '../entities/orderLog.entity';

export class OrderDto extends BaseDto<OrderDto> {
  @AutoMap()
  id: string;

  buyerId: string;

  @AutoMap(() => UserEntity)
  buyer: UserEntity;

  @AutoMap()
  freelancerId: string;

  @AutoMap(() => FreelancerEntity)
  freelancer: FreelancerEntity;

  /* GIG */
  @AutoMap()
  gigId: string;

  @AutoMap(() => GigEntity)
  gig: GigEntity;

  @AutoMap()
  currency: string;

  @AutoMap()
  note: string;

  @AutoMap() 
  snapshot: any;

  @AutoMap() 
  price: number;

  @AutoMap() 
  quantity: number;

  @AutoMap()
  totalAmount: number;

  @AutoMap()
  deliveryTime: number; // days

  @AutoMap(() => Date)
  expectedDeliveryDate: Date;

  @AutoMap()
  status: OrderStatus;

  // @AutoMap(() => TransactionEntity)
  // @OneToOne(() => TransactionEntity, (transaction) => transaction.order, {
  //   cascade: true,
  //   eager: true,
  // })
  // @JoinColumn()
  // transaction: TransactionEntity;

  @AutoMap(() => [TransactionEntity])
  transactions: TransactionEntity[];

  @AutoMap(() => [OrderLogEntity])
  logs: OrderLogEntity[];

  @AutoMap(() => [GigReviewEntity])
  review: GigReviewEntity;
}
