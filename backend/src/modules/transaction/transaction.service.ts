import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderStatus } from '../order/order.enum';
import { FreelancerTransactionEntity } from './entities/freelancer_transactions.entity';
import { FreelancerWalletEntity } from './entities/freelancer_wallet.entity';
import { OrderTransactionEntity } from './entities/order_transactions.entity';
import {
  TransactionDirection,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from './enum/transaction.enum';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly orderTransactionRepo: Repository<OrderTransactionEntity>,

    @InjectRepository(FreelancerTransactionEntity)
    private readonly freelancerTransactionRepo: Repository<FreelancerTransactionEntity>,

    @InjectRepository(FreelancerWalletEntity)
    private readonly freelancerWalletRepo: Repository<FreelancerWalletEntity>,
  ) {}
  @Inject(DataSource) protected readonly dataSource: DataSource;

  async incrementPendingBalance(order: OrderEntity) {
    if (!order || order.status !== OrderStatus.COMPLETED) return;

    const freelancerId = order.freelancerId;
    const amount = order.totalAmount;

    // Tạo transaction thu nhập
    const tx = this.freelancerTransactionRepo.create({
      freelancerId,
      type: TransactionType.EARNING,
      amount,
      status: TransactionStatus.PENDING,
      direction: TransactionDirection.IN,
      method: TransactionMethod.WALLET,
      orderId: order.id,
      metadata: {
        description: `Earning from Order #${order.id}`,
      },
    });

    const freelancerWallet = await this.freelancerWalletRepo.findOne({
      where: { freelancerId: freelancerId },
    });

    if (!freelancerWallet) {
      await this.freelancerWalletRepo.save({
        freelancerId: freelancerId,
      });
    }

    await this.freelancerWalletRepo.increment(
      { freelancerId },
      'pendingBalance',
      amount,
    );

    await this.freelancerTransactionRepo.save(tx);
  }

  async approvePendingBalance(freelancerId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const walletRepo = queryRunner.manager.getRepository(
        FreelancerWalletEntity,
      );

      // Lock hàng wallet đó để tránh race condition
      const wallet = await walletRepo.findOne({
        where: { freelancer: { id: freelancerId } },
        lock: { mode: 'pessimistic_write' }, // khóa ghi
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.pendingBalance < amount) {
        throw new Error('Not enough pending balance');
      }

      // Cập nhật số dư
      wallet.pendingBalance -= amount;
      wallet.availableBalance += amount;

      await walletRepo.save(wallet);

      // Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // Rollback nếu lỗi
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async approveAllPendingBalances(batchSize = 100) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const walletRepo = queryRunner.manager.getRepository(
        FreelancerWalletEntity,
      );

      // Lấy danh sách wallet có pendingBalance > 0
      const wallets = await walletRepo.find({
        where: { pendingBalance: MoreThan(0) },
        take: batchSize,
        lock: { mode: 'pessimistic_write' }, // khóa ghi
      });

      for (const wallet of wallets) {
        console.log(wallet);
        debugger;
        
        wallet.availableBalance += Number(wallet.pendingBalance);
        wallet.pendingBalance = 0;
        await walletRepo.save(wallet);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createWithdrawalRequest({
    freelancerId,
    amount,
    method,
  }: {
    freelancerId: string;
    amount: number;
    method: string;
  }) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOneOrFail(
        FreelancerWalletEntity,
        {
          where: { freelancerId },
        },
      );

      if (wallet.availableBalance < amount) {
        throw new Error('Insufficient balance');
      }

      // Trừ tiền
      wallet.availableBalance -= amount;
      await queryRunner.manager.save(wallet);

      // Ghi transaction
      const transaction = queryRunner.manager.create(
        FreelancerTransactionEntity,
        {
          freelancer: { id: freelancerId },
          amount,
          direction: TransactionDirection.OUT,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          method: method as TransactionMethod,
          currency: wallet.currency,
        },
      );
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //  @Cron(CronExpression.EVERY_WEEK)
  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleApprovePending() {
  //   console.log('handleApprovePending');
  //   await this.approveAllPendingBalances(100);
  // }
}
