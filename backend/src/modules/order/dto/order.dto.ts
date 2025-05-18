import { AutoMap } from '@automapper/classes';
import { BaseDto } from 'src/modules/base/dto/base.dto';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { GigRatingEntity } from 'src/modules/gig_rating/entities/gigreview.entity';
import { OrderTransactionEntity } from 'src/modules/order/entities/order_transactions.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';

import { OrderLogsEntity } from '../entities/order_logs.entity';
import { OrderQuestionsEntity } from '../entities/order_questions.entity';
import { GigPackagesEntity } from 'src/modules/gig/entities/gig_packages.entity';
import { OrderDeliverablesEntity } from '../entities/order_deliverables.entity';
import { OrderStatus } from '../enum/order.enum';

export class OrderDto extends BaseDto<OrderDto> {
  @AutoMap()
  id: string;

  @AutoMap()
  orderNo: string;

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

  @AutoMap(() => GigPackagesEntity)
  package: GigPackagesEntity;

  @AutoMap()
  currency: string;

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

  @AutoMap(() => [OrderTransactionEntity])
  transactions: OrderTransactionEntity[];

  @AutoMap(() => [OrderLogsEntity])
  orderlogs: OrderLogsEntity[];

  @AutoMap(() => [OrderQuestionsEntity])
  orderQuestionsAnswers: OrderQuestionsEntity[];

  @AutoMap(() => GigRatingEntity)
  rating: GigRatingEntity;

  @AutoMap(() => [OrderDeliverablesEntity])
  deliverables: OrderDeliverablesEntity[];

  @AutoMap(() => Date)
  startDate: Date;

  @AutoMap(() => Date)
  endDate: Date;
}
