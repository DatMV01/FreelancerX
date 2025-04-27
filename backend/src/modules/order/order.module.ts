import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { OrderTransactionEntity } from '../transaction/entities/order_transactions.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { UserEntity } from '../user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderDeliverablesEntity } from './entities/order_deliverables.entity';
import { OrderLogsEntity } from './entities/order_logs.entity';
import { OrderQuestionsEntity } from './entities/order_questions.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderLogsEntity,
      OrderTransactionEntity,
      GigEntity,
      OrderQuestionsEntity,
      UserEntity,
      FreelancerEntity,
      OrderDeliverablesEntity,
    ]),
    TransactionModule,
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}
