import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Decimal from 'decimal.js';
import {
  DataSource,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  IsNull,
  Like,
  QueryRunner,
  Repository,
} from 'typeorm';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { MailService } from '../mail/mail.service';
import { OrderEntity } from '../order/entities/order.entity';
import { UserEntity } from '../user/entities/user.entity';
import { RequestWithdrawalDto } from './dto/create-widthdrawal.dto';
import { WalletEntity } from './entities/wallet.entity';
import { WalletTransactionEntity } from './entities/wallet_transactions.entity';
import {
  ActorType,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from './enum/transaction.enum';
import { GetTransactionsDto } from './dto/get-transaction.dto';
import { buildOrderClause, buildWhereClause } from 'src/utils/typeorm-utils';
import { RoleEnum } from '../role/enum/role.enum';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletTransactionEntity)
    private readonly walletTxRepo: Repository<WalletTransactionEntity>,

    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,

    protected readonly dataSource: DataSource,

    private readonly mailService: MailService,
  ) {}
  // @Inject(DataSource) protected readonly dataSource: DataSource;

  async addPendingEarningToFreelancer(order: OrderEntity) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { freelancer: { id: order.freelancerId } },
      });

      const wallet = await queryRunner.manager.findOneByOrFail(WalletEntity, {
        userId: user.id,
      });

      const transaction = new WalletTransactionEntity();
      transaction.walletId = wallet.id;
      transaction.type = TransactionType.EARNING;
      transaction.status = TransactionStatus.PENDING;
      transaction.amount = order.totalAmount;
      transaction.balanceBefore = wallet.availableBalance;
      transaction.balanceAfter = wallet.availableBalance;
      transaction.referenceCode = order.id;
      transaction.actorId = order.freelancerId;
      transaction.actorType = ActorType.FREELANCER;
      transaction.method = TransactionMethod.WALLET;
      transaction.description = `Pending earning for order #${order.id}`;

      await queryRunner.manager.save(WalletTransactionEntity, transaction);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async addPendingEarningWithTx(order: OrderEntity, queryRunner: QueryRunner) {
    const user = await queryRunner.manager.findOneOrFail(UserEntity, {
      where: { freelancer: { id: order.freelancerId } },
    });

    const wallet = await queryRunner.manager.findOneByOrFail(WalletEntity, {
      userId: user.id,
    });

    const balanceBefore = new Decimal(wallet.availableBalance);
    const amount = new Decimal(order.totalAmount);
    wallet.availableBalance = balanceBefore.plus(amount).toNumber();

    const transaction = new WalletTransactionEntity();
    transaction.walletId = wallet.id;
    transaction.type = TransactionType.EARNING;
    transaction.status = TransactionStatus.PENDING;
    transaction.amount = order.totalAmount;
    transaction.balanceBefore = balanceBefore.toNumber();
    transaction.balanceAfter = wallet.availableBalance;
    transaction.referenceCode = order.id;
    //transaction.actorId = order.freelancerId;
    transaction.actorType = ActorType.SYSTEM;
    transaction.method = TransactionMethod.WALLET;
    transaction.description = `Pending earning ${order.totalAmount} ${order.currency} for order #${order.id}`;

    await queryRunner.manager.save(WalletTransactionEntity, transaction);
  }

  async approvePendingEarning(
    {
      transactionId,
      orderId,
    }: {
      transactionId?: string;
      orderId?: string;
    },
    currentUser: JwtAccessPayloadType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let transaction: WalletTransactionEntity | null = null;

      if (transactionId) {
        transaction = await queryRunner.manager.findOneOrFail(
          WalletTransactionEntity,
          {
            where: {
              id: transactionId,
              type: TransactionType.EARNING,
              status: TransactionStatus.PENDING,
            },
          },
        );
      } else if (orderId) {
        transaction = await queryRunner.manager.findOneOrFail(
          WalletTransactionEntity,
          {
            where: {
              referenceCode: orderId,
              type: TransactionType.EARNING,
              status: TransactionStatus.PENDING,
            },
          },
        );
      } else {
        throw new Error('Either transactionId or orderId must be provided.');
      }

      const wallet = await queryRunner.manager.findOneOrFail(WalletEntity, {
        where: { id: transaction.walletId },
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const amount = new Decimal(transaction.amount);
      wallet.availableBalance = balanceBefore.plus(amount).toNumber();

      transaction.status = TransactionStatus.SUCCESS;
      transaction.balanceBefore = balanceBefore.toNumber();
      transaction.balanceAfter = wallet.availableBalance;
      transaction.processedAt = new Date();
      transaction.processedBy = currentUser.id;

      await queryRunner.manager.save(WalletEntity, wallet);
      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async requestWithdraw(
    userId: string,
    requestWithdrawalDto: RequestWithdrawalDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOneOrFail(WalletEntity, {
        where: { userId },
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const amount = new Decimal(requestWithdrawalDto.amount);
      if (balanceBefore.lessThan(amount)) {
        throw new Error('Not enough available balance');
      }

      wallet.availableBalance = balanceBefore.minus(amount).toNumber();

      const transaction = new WalletTransactionEntity();
      transaction.walletId = wallet.id;
      transaction.type = TransactionType.WITHDRAW;
      transaction.status = TransactionStatus.PENDING;
      transaction.amount = amount.toNumber();
      transaction.balanceBefore = balanceBefore.toNumber();
      transaction.balanceAfter = wallet.availableBalance;
      transaction.referenceCode = this.generateReferenceCode(
        TransactionType.WITHDRAW,
      );
      transaction.actorId = userId;
      transaction.actorType = ActorType.FREELANCER;
      transaction.method = requestWithdrawalDto.method;
      transaction.metadata = {
        methodMetadata: requestWithdrawalDto.methodMetadata,
      };
      transaction.description = 'Request withdrawal';

      await queryRunner.manager.save(WalletEntity, wallet);
      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async approveWithdraw(
    transactionId: string,
    currentUser: JwtAccessPayloadType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOneOrFail(
        WalletTransactionEntity,
        {
          where: {
            id: transactionId,
            type: TransactionType.WITHDRAW,
            status: TransactionStatus.PENDING,
          },
        },
      );

      transaction.status = TransactionStatus.SUCCESS;
      transaction.processedAt = new Date();
      transaction.processedBy = currentUser.id;

      await queryRunner.manager.save(WalletTransactionEntity, transaction);
      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: transaction.actorId },
      });

      if (user?.email) {
        await this.mailService.sendWithdrawalSuccessEmail({
          // to: user.email,
          to: 'mamotgio@gmail.com',
          name: user.fullName,
          amount: new Decimal(transaction.amount).toFixed(2),
          currency: transaction.currency,
          referenceCode: transaction.referenceCode,
        });
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async rejectWithdraw(
    transactionId: string,
    reason: string,
    currentUser: JwtAccessPayloadType,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await queryRunner.manager.findOneOrFail(
        WalletTransactionEntity,
        {
          where: {
            id: transactionId,
            type: TransactionType.WITHDRAW,
            status: TransactionStatus.PENDING,
          },
        },
      );

      const wallet = await queryRunner.manager.findOneOrFail(WalletEntity, {
        where: { id: transaction.walletId },
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const refundAmount = new Decimal(transaction.amount);

      wallet.availableBalance = balanceBefore.plus(refundAmount).toNumber();

      transaction.status = TransactionStatus.REJECT;
      transaction.processedBy = currentUser.id;
      transaction.metadata = {
        ...transaction.metadata,
        reason,
      };

      await queryRunner.manager.save(WalletEntity, wallet);
      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: transaction.actorId },
      });

      if (user?.email) {
        await this.mailService.sendWithdrawalRejectedEmail({
          // to: user.email,
          to: 'mamotgio@gmail.com',
          name: user.fullName,
          amount: new Decimal(transaction.amount).toFixed(2),
          currency: wallet.currency,
          rejectionReason: reason.toString(),
          referenceCode: transaction.referenceCode,
        });
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async refundToBuyerWithTx(order: OrderEntity, queryRunner: QueryRunner) {
    const user = await queryRunner.manager.findOneOrFail(UserEntity, {
      where: { id: order.buyerId },
    });

    const wallet = await queryRunner.manager.findOneByOrFail(WalletEntity, {
      userId: user.id,
    });

    const balanceBefore = new Decimal(wallet.availableBalance);
    const refundAmount = new Decimal(order.totalAmount);

    wallet.availableBalance = balanceBefore.plus(refundAmount).toNumber();

    await queryRunner.manager.save(WalletEntity, wallet);

    const refundTransaction = new WalletTransactionEntity();
    refundTransaction.referenceCode = order.id;
    refundTransaction.walletId = wallet.id;
    refundTransaction.type = TransactionType.REFUND;
    refundTransaction.status = TransactionStatus.SUCCESS;
    refundTransaction.amount = refundAmount.toNumber();
    refundTransaction.balanceBefore = balanceBefore.toNumber();
    refundTransaction.balanceAfter = wallet.availableBalance;
    //  refundTransaction.actorId = order.buyerId;
    refundTransaction.actorType = ActorType.SYSTEM;
    refundTransaction.description = `Refund ${order.currency}${order.totalAmount} for canceled order #${order.id}`;

    await queryRunner.manager.save(WalletTransactionEntity, refundTransaction);
  }

  async refundToBuyer(order: OrderEntity) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOneOrFail(UserEntity, {
        where: { id: order.buyerId },
      });

      const wallet = await queryRunner.manager.findOneByOrFail(WalletEntity, {
        userId: user.id,
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const refundAmount = new Decimal(order.totalAmount);

      wallet.availableBalance = balanceBefore.plus(refundAmount).toNumber();

      await queryRunner.manager.save(WalletEntity, wallet);

      const refundTransaction = new WalletTransactionEntity();
      refundTransaction.walletId = wallet.id;
      refundTransaction.type = TransactionType.REFUND;
      refundTransaction.status = TransactionStatus.SUCCESS;
      refundTransaction.amount = refundAmount.toNumber();
      refundTransaction.balanceBefore = balanceBefore.toNumber();
      refundTransaction.balanceAfter = wallet.availableBalance;
      refundTransaction.referenceCode = this.generateReferenceCode(
        TransactionType.REFUND,
      );
      refundTransaction.actorId = order.buyerId;
      refundTransaction.actorType = ActorType.BUYER;
      refundTransaction.description = `Refund for canceled order #${order.id}`;

      await queryRunner.manager.save(
        WalletTransactionEntity,
        refundTransaction,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deposit(userId: string, amount: number, description = 'Deposit') {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOneOrFail(WalletEntity, {
        where: { userId },
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const depositAmount = new Decimal(amount);

      wallet.availableBalance = balanceBefore.plus(depositAmount).toNumber();

      await queryRunner.manager.save(WalletEntity, wallet);

      const transaction = new WalletTransactionEntity();
      transaction.walletId = wallet.id;
      transaction.type = TransactionType.DEPOSIT;
      transaction.status = TransactionStatus.SUCCESS;
      transaction.amount = depositAmount.toNumber();
      transaction.balanceBefore = balanceBefore.toNumber();
      transaction.balanceAfter = wallet.availableBalance;
      transaction.referenceCode = this.generateReferenceCode(
        TransactionType.DEPOSIT,
      );
      transaction.actorId = userId;
      transaction.actorType = ActorType.BUYER;
      transaction.description = description;

      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async adjustBalance(
    userId: string,
    amount: number,
    actorType = ActorType.ADMIN,
    description = 'Manual balance adjustment',
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager.findOneOrFail(WalletEntity, {
        where: { userId },
      });

      const balanceBefore = new Decimal(wallet.availableBalance);
      const adjustmentAmount = new Decimal(amount);

      wallet.availableBalance = balanceBefore.plus(adjustmentAmount).toNumber();

      await queryRunner.manager.save(WalletEntity, wallet);

      const transaction = new WalletTransactionEntity();
      transaction.walletId = wallet.id;
      transaction.type = TransactionType.ADJUSTMENT;
      transaction.status = TransactionStatus.SUCCESS;
      transaction.amount = adjustmentAmount.toNumber();
      transaction.balanceBefore = balanceBefore.toNumber();
      transaction.balanceAfter = wallet.availableBalance;
      transaction.referenceCode = this.generateReferenceCode(
        TransactionType.ADJUSTMENT,
      );
      transaction.actorId = userId;
      transaction.actorType = actorType;
      transaction.description = description;

      await queryRunner.manager.save(WalletTransactionEntity, transaction);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getWalletInfo(userId: string) {
    const wallet = await this.walletRepo.findOne({
      where: { userId },
    });

    if (!wallet) {
      throw new NotFoundException('Wallet not found.');
    }

    const availableBalance = new Decimal(wallet.availableBalance);

    const transactionsCount = await this.dataSource
      .getRepository(WalletTransactionEntity)
      .count({
        where: { walletId: wallet.id },
      });

    return {
      walletId: wallet.id,
      availableBalance: availableBalance.toNumber(),
      currency: wallet.currency,
      createdAt: wallet.createdAt,
      transactionsCount: transactionsCount || 0,
    };
  }

  async getWalletTransactions(
    userId: string,
    filter: {
      page?: number;
      limit?: number;
      type?: TransactionType; // optional: EARNING | WITHDRAWAL | REFUND | ...
      status?: TransactionStatus; // optional: SUCCESS | FAILED | PENDING
      startDate?: Date;
      endDate?: Date;
    },
  ) {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.walletTxRepo
      .createQueryBuilder('transaction')
      .where('transaction.actorId = :userId', { userId })
      .andWhere('transaction.actorType = :actorType', {
        actorType: ActorType.FREELANCER,
      });

    if (filter.type) {
      query.andWhere('transaction.type = :type', { type: filter.type });
    }

    if (filter.status) {
      query.andWhere('transaction.status = :status', { status: filter.status });
    }

    if (filter.startDate && filter.endDate) {
      query.andWhere('transaction.createdAt BETWEEN :startDate AND :endDate', {
        startDate: filter.startDate,
        endDate: filter.endDate,
      });
    }

    const [items, total] = await query
      .orderBy('transaction.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      data: items.map((tx) => ({
        id: tx.id,
        type: tx.type,
        status: tx.status,
        amount: tx.amount,
        description: tx.description,
        createdAt: tx.createdAt,
      })),
    };
  }

  async findAll2(
    page = 1,
    limit = 10,
    filters?: FindOptionsWhere<WalletTransactionEntity>,
    sorts?: FindOptionsOrder<WalletTransactionEntity>,
    fields?: (keyof WalletTransactionEntity)[],
    currentUser?: JwtAccessPayloadType,
  ): Promise<[WalletTransactionEntity[], number]> {
    try {
      const queryBuilder = this.walletTxRepo.createQueryBuilder('transaction');

      // Nếu người dùng không phải là admin, thêm điều kiện lọc theo ví của người dùng
      if (currentUser?.role.toLocaleLowerCase() !== 'admin') {
        const wallet = await this.walletRepo.findOne({
          where: { userId: currentUser?.id },
        });

        if (!wallet) throw new Error('Wallet not found');

        queryBuilder.andWhere('transaction.walletId = :walletId', {
          walletId: wallet.id,
        });
      }

      // Áp dụng các điều kiện lọc
      if (filters) {
        Object.keys(filters).forEach((key) => {
          const value = filters[key];
          if (value === undefined || value === null) return;

          if (Array.isArray(value)) {
            queryBuilder.andWhere(`transaction.${key} IN (:...values)`, {
              values: value,
            });
          } else if (typeof value === 'string') {
            const normalizedValue = value.trim().toLowerCase();
            if (normalizedValue.startsWith('like_')) {
              queryBuilder.andWhere(`LOWER(transaction.${key}) LIKE :value`, {
                value: `%${normalizedValue.replace('like_', '')}%`,
              });
            } else if (/^(>|>=|<|<=|=)_/.test(normalizedValue)) {
              const operator = normalizedValue.slice(
                0,
                normalizedValue.indexOf('_'),
              );
              const actualValue = normalizedValue
                .slice(normalizedValue.indexOf('_') + 1)
                .trim();
              queryBuilder.andWhere(`transaction.${key} ${operator} :value`, {
                value: actualValue,
              });
            } else {
              queryBuilder.andWhere(`transaction.${key} = :value`, { value });
            }
          } else {
            queryBuilder.andWhere(`transaction.${key} IS NULL`);
          }
        });
      }

      // Áp dụng các điều kiện sắp xếp
      if (sorts) {
        Object.entries(sorts).forEach(([key, order]) => {
          queryBuilder.addOrderBy(
            `transaction.${key}`,
            (order as string).toUpperCase() as 'ASC' | 'DESC',
          );
        });
      }

      // Lấy tổng số bản ghi
      const [data, total] = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .select(fields ? fields.map((field) => `transaction.${field}`) : [])
        .getManyAndCount();

      return [data, total];
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async findAll(
    page = 1,
    pageSize = 10,
    filters?: FindOptionsWhere<WalletTransactionEntity>,
    sorts?: FindOptionsOrder<WalletTransactionEntity>,
    fields?: (keyof WalletTransactionEntity)[],
    currentUser?: JwtAccessPayloadType,
  ): Promise<[WalletTransactionEntity[], number]> {
    try {
      if (currentUser?.role.toUpperCase() !== RoleEnum[RoleEnum.ADMIN]) {
        const wallet = await this.walletRepo.findOne({
          where: { userId: currentUser?.id },
        });

        if (!wallet) {
          throw new Error('Wallet not found');
        }

        filters = {
          ...filters,
          walletId: wallet.id,
        };
      }

      let options: FindManyOptions<WalletTransactionEntity> = {
        where: buildWhereClause(filters),
        order: buildOrderClause(sorts),
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: fields as any,
      };

      const [data, total] = await this.walletTxRepo.findAndCount(options);

      return [data, total];
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  generateReferenceCode(transactionType: TransactionType): string {
    let prefix = 'TX'; // default nếu không match type

    switch (transactionType) {
      case TransactionType.WITHDRAW:
        prefix = 'WD';
        break;
      case TransactionType.PAYMENT:
        prefix = 'PMT';
        break;
      case TransactionType.REFUND:
        prefix = 'RF';
        break;
      case TransactionType.EARNING:
        prefix = 'EARN';
        break;
      case TransactionType.DEPOSIT:
        prefix = 'DEP';
        break;
      case TransactionType.PLATFORM_FEE:
        prefix = 'FEE';
        break;
      case TransactionType.ADJUSTMENT:
        prefix = 'ADJ';
        break;
      default:
        prefix = 'TX'; // transaction chung chung
    }

    return `${prefix}-${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}-${Math.floor(Math.random() * 1000)}`;
  }

  async getEarningsDataByYear(currentUser: JwtAccessPayloadType, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const wallet = await this.walletRepo.findOne({
      where: { userId: currentUser?.id },
    });

    if (!wallet) {
      throw new Error('Wallet not found');
    }

    const rawData = await this.walletTxRepo
      .createQueryBuilder('transaction')
      .select([
        'EXTRACT(MONTH FROM transaction.createdAt) AS month',
        `COALESCE(SUM(CASE WHEN transaction.type = :earning THEN transaction.amount ELSE 0 END), 0) AS "totalEarnings"`,
        `COALESCE(SUM(CASE WHEN transaction.type = :withdrawal THEN transaction.amount ELSE 0 END), 0) AS "totalWithdrawals"`,
        `COALESCE(SUM(CASE WHEN transaction.type = :refund THEN transaction.amount ELSE 0 END), 0) AS "totalRefunds"`,
      ])

      .where('transaction.walletId = :walletId', { walletId: wallet.id })
      // .andWhere('transaction.actorType = :actorType', {
      //   actorType: ActorType.FREELANCER,
      // })
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
        earning: TransactionType.EARNING,
        withdrawal: TransactionType.WITHDRAW,
        refund: TransactionType.REFUND,
      })
      .getRawMany();

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
      const totalEarnings = found ? Number(found.totalEarnings) : 0;
      const totalWithdrawals = found ? Number(found.totalWithdrawals) : 0;
      const totalRefunds = found ? Number(found.totalRefunds) : 0;
      //  const netEarnings = totalEarnings - totalWithdrawals;

      return {
        month: name,
        totalEarnings,
        totalWithdrawals,
        totalRefunds,
        //  netEarnings,
      };
    });

    return {
      [year]: earningsData,
    };
  }

  //  @Cron(CronExpression.EVERY_WEEK)
  // @Cron(CronExpression.EVERY_MINUTE)
  // async handleApprovePending() {
  //   console.log('handleApprovePending');
  //   await this.approveAllPendingBalances(100);
  // }
}
