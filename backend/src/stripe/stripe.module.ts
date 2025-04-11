import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderLogEntity } from 'src/modules/order/entities/orderLog.entity';
import { OrderModule } from 'src/modules/order/order.module';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { TransactionStripeEntity } from 'src/modules/transaction/entities/transactionStripe.entity';
import Stripe from 'stripe';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      TransactionEntity,
      TransactionStripeEntity,
      OrderEntity,
      OrderLogEntity,
    ]),
  ],
  controllers: [StripeController],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new Stripe(config.get('STRIPE_SECRET_KEY') as any, {
          apiVersion: '2025-03-31.basil',
        });
      },
    },
    StripeService,
  ],
  exports: ['STRIPE_CLIENT'],
})
export class StripeModule {}
