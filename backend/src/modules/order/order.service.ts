import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, LessThan, Repository } from 'typeorm';
import { BaseService } from '../base/base.service';
import { OrderEntity, OrderStatus } from './entities/order.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

import {
  TransactionEntity,
  TransactionProvider,
  TransactionStatus,
  TransactionType,
} from '../transaction/entities/transaction.entity';
import { StripeService } from 'src/stripe/stripe.service';
import { GigEntity } from '../gig/entities/gig.entity';
import { GigService } from '../gig/gig.service';
import { consoleError } from 'src/utils/common';
import { TransactionStripeEntity } from '../transaction/entities/transactionStripe.entity';
import {
  OrderAction,
  OrderActor,
  OrderLogEntity,
} from './entities/orderLog.entity';
import { OrderQuestionsAnswersEntity } from './entities/orderQA.entity';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _repository: Repository<OrderEntity>,

    @InjectRepository(GigEntity)
    private gigRepo: Repository<GigEntity>,

    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,

    @InjectRepository(TransactionStripeEntity)
    private transactionStripeRepo: Repository<TransactionStripeEntity>,

    @InjectRepository(OrderLogEntity)
    private readonly orderLogRepo: Repository<OrderLogEntity>,

    @InjectRepository(OrderQuestionsAnswersEntity)
    private readonly orderQuestionsAnswersEntityRepo: Repository<OrderQuestionsAnswersEntity>,

    private stripeService: StripeService,
  ) {
    super(_repository);
  }

  async createOrder(createDto: DeepPartial<OrderEntity>): Promise<{
    orderId: string;
    transactionId: string;
    transactionStripeId: string;
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const { gigId, packageId, quantity, status, buyerId } = createDto;

    const currency = createDto.currency || 'USD';

    const gig = await this.gigRepo.findOneBy({ id: String(gigId) });
    if (!gig) {
      consoleError(`Gig with ID ${gig} not found`);
      throw new NotFoundException(`Gig with ID ${packageId} not found`);
    }

    const gigPackage = gig.packages.find((_) => _.id === packageId);

    if (!gigPackage) {
      consoleError(`Package with ID ${packageId} not found`);
      throw new NotFoundException(`Package with ID ${packageId} not found`);
    }

    const { price, deliveryTime } = gigPackage;

    const { createdAt, updatedAt, deletedAt, ...snapshot } = gigPackage;

    const totalAmount = Number(quantity) * Number(price);

    const createOrder = this._repository.create({
      id: uuidv4(),
      buyerId,
      freelancerId: gig.freelancerId,
      gigId,
      packageId,
      currency,
      price: price,
      quantity,
      totalAmount,
      deliveryTime: deliveryTime,
      status: status || OrderStatus.PENDING,
      snapshot,
    });

    const createTransaction = this.transactionRepo.create({
      id: uuidv4(),
      orderId: createOrder.id,
      userId: createDto.buyerId,
      amount: totalAmount,
      type: TransactionType.PAYMENT,
      provider: TransactionProvider.STRIPE,
      status: TransactionStatus.PENDING,
      currency,
    });

    const { client_secret, id: stripePaymentIntentId } =
      await this.stripeService.createPaymentIntent({
        amount: totalAmount,
        currency,
        metadata: {
          orderId: createOrder.id,
          buyerId,
          gigId,
          packageId,
          transactionId: createTransaction.id,
        },
      });

    const createTransactionStripe = this.transactionStripeRepo.create({
      id: uuidv4(),
      transactionId: createTransaction.id,
      paymentIntentId: stripePaymentIntentId,
      clientSecret: client_secret || undefined,
    });

    const createOrderLog = this.orderLogRepo.create({
      id: uuidv4(),
      order: createOrder,
      action: OrderAction.ORDER_CREATED,
      actor: OrderActor.SELLER,
      detail: `Created order with ${gigPackage.type} package. Price: ${totalAmount}${currency}`,
    });

    const saveOrder = await this._repository.save(createOrder);

    const saveTransaction = await this.transactionRepo.save(createTransaction);

    const saveTransactionStripe = await this.transactionStripeRepo.save(
      createTransactionStripe,
    );

    await this.orderLogRepo.save(createOrderLog);

    // const orderSave = await super.findOne({
    //   where: { id: saveOrder.id },
    //   relations: ['transactions', 'transactions.transactionStripe'],
    // });

    return {
      orderId: saveOrder.id,
      transactionId: saveTransaction.id,
      transactionStripeId: saveTransactionStripe.id,
      clientSecret: saveTransactionStripe.clientSecret,
      paymentIntentId: saveTransactionStripe.paymentIntentId,
    } as any;
  }

  async addQuestionsAnswersToOrder(
    data: OrderQuestionsAnswersEntity,
    currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsAnswersEntity> {
    const { orderId, question, answer, file } = data;

    const order = await super.findOneById(orderId);

    const createQuestionAnswer = this.orderQuestionsAnswersEntityRepo.create({
      ...data,
      order,
    });

    return this.orderQuestionsAnswersEntityRepo.save(createQuestionAnswer);
  }

  getExpectedDate(deliveryTime: number): Date {
    const now = new Date();
    now.setDate(now.getDate() + deliveryTime);
    return now;
  }

  // @Cron(CronExpression.EVERY_30_MINUTES)
  // async handleExpiredOrders() {
  //   this.logger.log(`Cron EVERY_30_MINUTES `);

  //   const now = new Date();
  //   const expiredTime = new Date(now.getTime() - 30 * 60 * 1000);

  //   const pendingOrders = await this._repository.find({
  //     where: {
  //       status: OrderStatus.PENDING,
  //       createdAt: LessThan(expiredTime),
  //       transaction: {
  //         status: TransactionStatus.PENDING,
  //       },
  //     },
  //     relations: ['transaction'],
  //   });

  //   if (pendingOrders.length) {
  //     this.logger.log(
  //       `🕒 Found ${pendingOrders.length} pending orders older than 30 minutes.`,
  //     );

  //     for (const order of pendingOrders) {
  //       order.status = OrderStatus.CANCELED;
  //       order.transaction.status = TransactionStatus.FAILED;

  //       await this._repository.save(order);
  //       await this.transactionRepository.save(order.transaction);

  //       this.logger.log(
  //         `❌ Marked Order #${order.id} and Transaction #${order.transaction.id} as failed.`,
  //       );
  //     }
  //   }
  // }
}
