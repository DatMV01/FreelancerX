import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { StripeModule } from 'src/stripe/stripe.module';
import { StripeService } from 'src/stripe/stripe.service';
import { GigEntity, GigTagEntity } from '../gig/entities/gig.entity';
import { GigService } from '../gig/gig.service';
import { TransactionStripeEntity } from '../transaction/entities/transactionStripe.entity';
import { FreelancerService } from '../freelancer/freelancer.service';
import { FreelancerModule } from '../freelancer/freelancer.module';
import { GigModule } from '../gig/gig.module';
import { PackageEntity } from '../gig/entities/package.entity';
import { OrderLogEntity } from './entities/orderLog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderLogEntity,
      TransactionEntity,
      GigEntity,
      TransactionStripeEntity,
    ]),
    // TransactionModule,
    StripeModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, StripeService],
})
export class OrderModule {}
