import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FreelancerTransactionEntity } from './entities/freelancer_transactions.entity';
import { FreelancerWalletEntity } from './entities/freelancer_wallet.entity';
import { OrderTransactionEntity } from './entities/order_transactions.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderTransactionEntity,
      FreelancerWalletEntity,
      FreelancerTransactionEntity,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService, TypeOrmModule],
})
export class TransactionModule {}
