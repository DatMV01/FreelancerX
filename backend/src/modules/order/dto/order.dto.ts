import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
 
import { OrderLogEntity } from '../entities/orderLog.entity';
import { OrderQuestionsAnswersEntity } from '../entities/orderQA.entity';
import { PackageEntity } from 'src/modules/gig/entities/package.entity';
import { OrderDeliveryEntity } from '../entities/orderDelivery.entity';
import { OrderStatus } from '../order.enum';

export class OrderDto extends BaseDto<OrderDto> {
  @AutoMap()
  id: string;

  @AutoMap()
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
  packageId: string;

  @AutoMap(() => PackageEntity)
  package: PackageEntity;

  @AutoMap()
  currency: string;

  @AutoMap()
  note: string;

  @AutoMap()
  price: number;

  @AutoMap()
  quantity: number;

  @AutoMap()
  totalAmount: number;

  @AutoMap()
  deliveryTime: number; // days

  @AutoMap()
  status: OrderStatus;

  @AutoMap(() => Object)
  snapshot: object;

  @AutoMap(() => [TransactionEntity])
  transactions: TransactionEntity[];

  @AutoMap(() => [OrderLogEntity])
  orderlogs: OrderLogEntity[];

  @AutoMap(() => [OrderQuestionsAnswersEntity])
  orderQuestionsAnswers: OrderQuestionsAnswersEntity[];

  @AutoMap(() => [GigReviewEntity])
  review: GigReviewEntity[];

  @AutoMap(() => [OrderDeliveryEntity])
  deliverables: OrderDeliveryEntity[];

  @AutoMap(() => Date)
  startDate: Date;

  @AutoMap(() => Date)
  endDate: Date;
}
