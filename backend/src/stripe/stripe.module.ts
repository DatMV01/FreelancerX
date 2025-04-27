import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { OrderLogsEntity } from 'src/modules/order/entities/order_logs.entity';
import { OrderTransactionEntity } from 'src/modules/transaction/entities/order_transactions.entity';
import Stripe from 'stripe';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([OrderTransactionEntity, OrderEntity, OrderLogsEntity]),
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
