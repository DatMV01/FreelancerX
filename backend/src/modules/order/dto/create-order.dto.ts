import { AutoMap } from '@automapper/classes';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { OrderLogEntity } from '../entities/orderLog.entity';
import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @AutoMap()
  @IsOptional()
  buyerId: string;

  @AutoMap()
  @IsOptional()
  gigId: string;

  @AutoMap()
  @IsOptional()
  packageId: string;

  @AutoMap()
  @IsOptional()
  currency: string;

  @AutoMap()
  @IsOptional()
  quantity: number;

  @AutoMap()
  @IsOptional()
  status: OrderStatus = OrderStatus.PENDING;
}
