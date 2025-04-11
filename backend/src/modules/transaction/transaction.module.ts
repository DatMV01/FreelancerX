import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionStripeEntity } from './entities/transactionStripe.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, TransactionStripeEntity]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
