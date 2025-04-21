import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { TransactionStripeEntity } from '../transaction/entities/transactionStripe.entity';
import { UserEntity } from '../user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderDeliveryEntity } from './entities/orderDelivery.entity';
import { OrderLogEntity } from './entities/orderLog.entity';
import { OrderQuestionsAnswersEntity } from './entities/orderQA.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderLogEntity,
      TransactionEntity,
      GigEntity,
      TransactionStripeEntity,
      OrderQuestionsAnswersEntity,
      UserEntity,
      FreelancerEntity,
      OrderDeliveryEntity,
    ]),
    // TransactionModule,
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}
