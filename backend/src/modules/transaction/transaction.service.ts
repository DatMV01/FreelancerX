import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  MoreThan,
  Repository,
} from 'typeorm';
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
import { CreateWithdrawalDto } from './dto/create-widthdrawal.dto';
import Decimal from 'decimal.js';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseService } from '../base/base.service';
import { MailService } from '../mail/mail.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(OrderTransactionEntity)
    private readonly orderTransactionRepo: Repository<OrderTransactionEntity>,

    @InjectRepository(FreelancerTransactionEntity)
    private readonly freelancerTransactionRepo: Repository<FreelancerTransactionEntity>,

    @InjectRepository(FreelancerWalletEntity)
    private readonly freelancerWalletRepo: Repository<FreelancerWalletEntity>,

    protected readonly dataSource: DataSource,

    private readonly mailService: MailService,
  ) {}
  // @Inject(DataSource) protected readonly dataSource: DataSource;

  async findAll(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<FreelancerTransactionEntity>,
    sorts?: FindOptionsOrder<FreelancerTransactionEntity>,
    fields?: (keyof FreelancerTransactionEntity)[],
    currentUser?: JwtAccessPayloadType,
  ): Promise<[FreelancerTransactionEntity[], number]> {
    try {
      const whereConditions: FindOptionsWhere<FreelancerTransactionEntity> =
        filters || {};
      const orderConditions: FindOptionsOrder<FreelancerTransactionEntity> =
        sorts || {
          updatedAt: 'DESC',
          createdAt: 'DESC',
        };

      if (currentUser?.role.toLocaleLowerCase() !== 'admin') {
        whereConditions['freelancerId'] = currentUser?.freelancerId as any;
      }

      let options: FindManyOptions<FreelancerTransactionEntity> = {
        where: this.processFilters(whereConditions),
        order: this.processSorting(orderConditions),
        skip: (page - 1) * limit,
        take: limit,
        select: fields ? (fields as any) : undefined,
      };

      const [data, total] =
        await this.freelancerTransactionRepo.findAndCount(options);

      return [data, total];
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

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

  async getWalletInfo({ freelancerId }: { freelancerId: string }) {
    try {
      // Lock hàng wallet đó để tránh race condition
      const wallet = await this.freelancerWalletRepo.findOne({
        where: { freelancerId },
      });

      if (!wallet) {
        throw new Error('Wallet not found');
      }

      return wallet;
    } catch (error) {
      throw error;
    }
  }

  async getEarningsDataByYear(freelancerId: string, year: number) {
    const startDate = new Date(year, 0, 1); // 1st Jan of the given year
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999); // 31st Dec of the given year

    const rawData = await this.freelancerTransactionRepo
      .createQueryBuilder('transaction')
      .select([
        'EXTRACT(MONTH FROM transaction.createdAt) AS month',
        `SUM(
          CASE WHEN transaction.type = :earningDirectionType THEN transaction.amount ELSE 0 END
        ) AS "totalEarnings"`,
        `SUM(
          CASE WHEN transaction.type = :withdrawDirectionType THEN transaction.amount ELSE 0 END
        ) AS "totalWithdrawals"`,
      ])
      .where('transaction.freelancerId = :freelancerId', { freelancerId })
      .andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .andWhere('transaction.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .setParameters({
        earningDirectionType: TransactionType.EARNING,
        withdrawDirectionType: TransactionType.WITHDRAWAL,
      })
      .getRawMany();

    // Map dữ liệu ra đủ 12 tháng (nếu thiếu tháng nào thì điền 0)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const earningsData = monthNames.map((name, index) => {
      const found = rawData.find((item) => Number(item.month) === index + 1);
      return {
        month: name,
        totalEarnings: found ? Number(found.totalEarnings) : 0,
        totalWithdrawals: found ? Number(found.totalWithdrawals) : 0,
      };
    });

    return {
      [year]: earningsData,
    };
  }
  async approveWithdraw(transactionId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(
        FreelancerTransactionEntity,
        {
          where: { id: transactionId },
        },
      );

      if (!transaction) {
        throw new NotFoundException('Transaction not found.');
      }

      if (transaction.type !== TransactionType.WITHDRAWAL) {
        throw new BadRequestException('Invalid transaction type.');
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new BadRequestException(
          'Transaction has already been processed.',
        );
      }

      const wallet = await queryRunner.manager.findOne(FreelancerWalletEntity, {
        where: { freelancerId: transaction.freelancerId },
      });

      if (!wallet) {
        throw new NotFoundException('Freelancer wallet not found.');
      }

      const pendingWithdraw = new Decimal(wallet.pendingWidthdraw);
      const amount = new Decimal(transaction.amount);

      if (pendingWithdraw.lessThan(amount)) {
        throw new BadRequestException(
          'Insufficient pending withdrawal balance.',
        );
      }

      // Update transaction status
      transaction.status = TransactionStatus.SUCCESS;
      await queryRunner.manager.save(FreelancerTransactionEntity, transaction);

      // Update wallet balance using Decimal
      wallet.pendingWidthdraw = pendingWithdraw.minus(amount).toNumber();
      await queryRunner.manager.save(FreelancerWalletEntity, wallet);

      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { freelancer: { id: transaction.freelancerId } },
      });

      if (user?.email) {
        await this.mailService.sendWithdrawalSuccessEmail({
          to: user.email,
          name: user.fullName,
          amount: amount.toString(),
          currency: wallet.currency,
          referenceCode: transaction.referenceCode,
        });
      }

      return { message: 'Withdrawal approved successfully.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelWithdraw(transactionId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(
        FreelancerTransactionEntity,
        {
          where: { id: transactionId },
        },
      );

      if (!transaction) {
        throw new NotFoundException('Transaction not found.');
      }

      if (transaction.type !== TransactionType.WITHDRAWAL) {
        throw new BadRequestException('Invalid transaction type.');
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new BadRequestException(
          'Only pending transactions can be canceled.',
        );
      }

      const wallet = await queryRunner.manager.findOne(FreelancerWalletEntity, {
        where: { freelancerId: transaction.freelancerId },
      });

      if (!wallet) {
        throw new NotFoundException('Freelancer wallet not found.');
      }

      const pendingWithdraw = new Decimal(wallet.pendingWidthdraw);
      const amount = new Decimal(transaction.amount);

      if (pendingWithdraw.lessThan(amount)) {
        throw new BadRequestException('Invalid pending withdrawal amount.');
      }

      // Update transaction status
      transaction.status = TransactionStatus.CANCELLED;
      await queryRunner.manager.save(FreelancerTransactionEntity, transaction);

      // Move back amount to available balance
      wallet.pendingWidthdraw = pendingWithdraw.minus(amount).toNumber();
      wallet.availableBalance = new Decimal(wallet.availableBalance)
        .plus(amount)
        .toNumber();

      await queryRunner.manager.save(FreelancerWalletEntity, wallet);

      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { freelancer: { id: transaction.freelancerId } },
      });

      if (user?.email) {
        await this.mailService.sendWithdrawalSuccessEmail({
          to: user.email,
          name: user.fullName,
          amount: amount.toString(),
          currency: wallet.currency,
          referenceCode: transaction.referenceCode,
        });
      }

      return { message: 'Withdrawal request has been cancelled successfully.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectWithdraw(transactionId: string, rejectionReason: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOne(
        FreelancerTransactionEntity,
        {
          where: { id: transactionId },
          relations: ['freelancer'], // để lấy email nếu cần
        },
      );

      if (!transaction) {
        throw new NotFoundException('Transaction not found.');
      }

      if (transaction.type !== TransactionType.WITHDRAWAL) {
        throw new BadRequestException('Invalid transaction type.');
      }

      if (transaction.status !== TransactionStatus.PENDING) {
        throw new BadRequestException(
          'Only pending transactions can be rejected.',
        );
      }

      const wallet = await queryRunner.manager.findOne(FreelancerWalletEntity, {
        where: { freelancerId: transaction.freelancerId },
      });

      if (!wallet) {
        throw new NotFoundException('Freelancer wallet not found.');
      }

      const pendingWithdraw = new Decimal(wallet.pendingWidthdraw);
      const amount = new Decimal(transaction.amount);

      if (pendingWithdraw.lessThan(amount)) {
        throw new BadRequestException('Invalid pending withdrawal amount.');
      }

      // Update transaction status and add rejection reason
      transaction.status = TransactionStatus.REJECT;
      transaction.metadata = {
        ...(transaction.metadata || {}),
        rejectionReason,
      };
      await queryRunner.manager.save(FreelancerTransactionEntity, transaction);

      // Update wallet balances
      wallet.pendingWidthdraw = pendingWithdraw.minus(amount).toNumber();
      wallet.availableBalance = new Decimal(wallet.availableBalance)
        .plus(amount)
        .toNumber();

      await queryRunner.manager.save(FreelancerWalletEntity, wallet);

      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOne(UserEntity, {
        where: { freelancer: { id: transaction.freelancerId } },
      });

      if (user?.email) {
        await this.mailService.sendWithdrawalRejectedEmail({
          to: user.email,
          name: user.fullName,
          amount: amount.toString(),
          currency: wallet.currency,
          rejectionReason: rejectionReason.toString(),
          //   referenceCode: transaction.referenceCode,
        });
      }

      return { message: 'Withdrawal request has been rejected successfully.' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createWithdrawal({
    freelancerId,
    data,
  }: {
    freelancerId: string;
    data: CreateWithdrawalDto;
  }) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOne(FreelancerWalletEntity, {
        where: { freelancerId },
      });

      if (!wallet) {
        throw new BadRequestException('Freelancer wallet does not exist.');
      }

      const { amount, method } = data;

      const availableBalanceDecimal = new Decimal(wallet.availableBalance);
      const pendingWidthdrawDecimal = new Decimal(wallet.pendingWidthdraw);

      const amountDecimal = new Decimal(amount);
      if (amountDecimal.greaterThan(availableBalanceDecimal)) {
        throw new BadRequestException('Available balance is insufficient.');
      }

      const referenceCode = `WDRAW-${new Date()
        .toISOString()
        .replace(/[-:T.]/g, '')
        .slice(0, 14)}-${Math.floor(Math.random() * 1000)}`;

      // Ghi transaction
      const transaction = queryRunner.manager.create(
        FreelancerTransactionEntity,
        {
          referenceCode,
          amount,
          method: method as TransactionMethod,
          direction: TransactionDirection.OUT,
          type: TransactionType.WITHDRAWAL,
          status: TransactionStatus.PENDING,
          freelancerId,
          metadata: data.metadata,
          currency: wallet.currency,
        },
      );

      wallet.availableBalance = availableBalanceDecimal.sub(amount).toNumber();
      wallet.pendingWidthdraw = pendingWidthdrawDecimal.add(amount).toNumber();

      await queryRunner.manager.save(wallet);
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

  private processFilters(
    filters: FindOptionsWhere<any>,
  ): FindOptionsWhere<any> {
    const processedFilters: FindOptionsWhere<any> = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (!value) return;

      if (Array.isArray(value)) {
        processedFilters[key] = In(value);
      } else if (typeof value === 'string') {
        const normalizedValue = value.trim().toLowerCase();
        if (normalizedValue.startsWith('like_')) {
          processedFilters[key] = Like(
            `%${normalizedValue.replace('like_', '').trim()}%`,
          );
        } else if (/^(>|>=|<|<=|=)_/.test(normalizedValue)) {
          const operator = normalizedValue.slice(
            0,
            normalizedValue.indexOf('_'),
          );
          const actualValue = normalizedValue
            .slice(normalizedValue.indexOf('_') + 1)
            .trim();

          processedFilters[key] = { [operator]: actualValue } as any;
        } else {
          processedFilters[key] = value;
        }
      } else {
        processedFilters[key] = IsNull();
      }
    });

    return processedFilters;
  }
  private processSorting(sorts: FindOptionsOrder<any>): FindOptionsOrder<any> {
    const processedSorts: FindOptionsOrder<any> = {};

    Object.entries(sorts || {}).forEach(([key, order]) => {
      processedSorts[key] = (order as any).toUpperCase() as 'ASC' | 'DESC';
    });

    return processedSorts;
  }
}
