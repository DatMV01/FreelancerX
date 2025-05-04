import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  In,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
import { nanoid } from 'nanoid';

import { v4 as uuidv4 } from 'uuid';
import { BaseService } from '../base/base.service';
import { OrderEntity } from './entities/order.entity';

import { StripeService } from 'src/stripe/stripe.service';
import { consoleError } from 'src/utils/common';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { BaseEntity } from '../base/entities/base.entity';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';
import { GigEntity } from '../gig/entities/gig.entity';
import { OrderTransactionEntity } from './entities/order_transactions.entity';

import { WalletService } from '../wallet/wallet.service';
import { UserEntity } from '../user/entities/user.entity';
import { OrderDeliverablesEntity } from './entities/order_deliverables.entity';
import { OrderLogsEntity } from './entities/order_logs.entity';
import { OrderQuestionsEntity } from './entities/order_questions.entity';
import {
  ActorType,
  OrderActions,
  OrderStatus,
  TransactionDirection,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from './enum/order.enum';
import { WalletEntity } from '../wallet/entities/wallet.entity';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _repository: Repository<OrderEntity>,

    @InjectRepository(GigEntity)
    private gigRepo: Repository<GigEntity>,

    @InjectRepository(OrderTransactionEntity)
    private orderTransactionRepo: Repository<OrderTransactionEntity>,

    @InjectRepository(OrderLogsEntity)
    private readonly orderLogRepo: Repository<OrderLogsEntity>,

    @InjectRepository(OrderQuestionsEntity)
    private readonly orderQuestionsAnswersRepo: Repository<OrderQuestionsEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(FreelancerEntity)
    private readonly freelancerRepo: Repository<FreelancerEntity>,

    @InjectRepository(OrderDeliverablesEntity)
    private readonly orderDeliveryRepo: Repository<OrderDeliverablesEntity>,
    private readonly walletService: WalletService,
    private readonly stripeService: StripeService,
  ) {
    super(_repository);
  }

  private readonly logger = new Logger(OrderService.name);

  async createOrder(
    createDto: DeepPartial<OrderEntity>,
    currentUser: JwtAccessPayloadType,
  ): Promise<{
    orderId: string;
    transactionId: string;
    clientSecret: string;
    paymentIntentId: string;
  }> {
    const { gig, buyer, gigPackage } = await this.validateEntities(createDto);

    const snapshot = this.buildSnapshot(buyer, gig, gigPackage);

    const totalAmount = Number(createDto.quantity) * Number(gigPackage.price);
    const currency = createDto.currency || 'USD';

    const createOrder = this._repository.create({
      id: uuidv4(),
      orderNo: this.generateOrderNo(),
      buyerId: buyer.id,
      freelancerId: gig.freelancerId,
      gigId: gig.id,
      packageId: gigPackage.id,
      currency,
      price: gigPackage.price,
      quantity: createDto.quantity,
      totalAmount,
      deliveryTime: gigPackage.deliveryTime,
      status: OrderStatus.UNPAID,
      snapshot,
    });

    const orderTx = this.orderTransactionRepo.create({
      id: uuidv4(),
      amount: totalAmount,
      direction: TransactionDirection.IN,
      method: TransactionMethod.STRIPE,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      actorType: ActorType.BUYER,
      actor: buyer,
      orderId: createOrder.id,
      currency,
    });

    const stripePaymentIntent = await this.createStripePaymentIntent({
      orderId: createOrder.id,
      buyerId: buyer.id,
      gigId: gig.id,
      packageId: gigPackage.id,
      transactionId: orderTx.id,
      totalAmount,
      currency,
    });

    orderTx.referenceCode = stripePaymentIntent.id;
    orderTx.metadata = stripePaymentIntent;

    const paymentUrl = `?orderId=${createOrder.id}&transactionId=${orderTx.id}&clientSecret=${stripePaymentIntent.client_secret}&paymentIntentId=${stripePaymentIntent.id}`;

    const createOrderLog = this.orderLogRepo.create({
      ...OrderActions.CREATE_ORDER,
      id: uuidv4(),
      actorId: currentUser.id,
      orderId: createOrder.id,
      metadata: { paymentUrl },
    });

    const result = await this.saveOrderWithTransaction(
      createOrder,
      orderTx,
      createOrderLog,
      paymentUrl,
    );

    return {
      orderId: result.saveOrder.id,
      transactionId: result.saveTransaction.id,
      clientSecret: stripePaymentIntent.client_secret ?? '',
      paymentIntentId: stripePaymentIntent.id,
    };
  }

  // Validate gig, buyer, package
  private async validateEntities(createDto: DeepPartial<OrderEntity>) {
    const { gigId, packageId, buyerId } = createDto;

    const gig = await this.gigRepo.findOneBy({ id: String(gigId) });
    if (!gig) {
      consoleError(`Gig with ID ${gigId} not found`);
      throw new NotFoundException(`Gig with ID ${gigId} not found`);
    }

    const buyer = await this.userRepo.findOneBy({ id: String(buyerId) });
    if (!buyer) {
      consoleError(`Buyer with ID ${buyerId} not found`);
      throw new NotFoundException(`Buyer with ID ${buyerId} not found`);
    }

    const gigPackage = gig.packages.find((pkg) => pkg.id === packageId);
    if (!gigPackage) {
      consoleError(`Package with ID ${packageId} not found`);
      throw new NotFoundException(`Package with ID ${packageId} not found`);
    }

    return { gig, buyer, gigPackage };
  }

  // Build snapshot
  private buildSnapshot(buyer: UserEntity, gig: GigEntity, gigPackage: any) {
    const { createdAt, updatedAt, deletedAt, ...packageInfomation } =
      gigPackage;
    return {
      buyer: {
        id: buyer.id,
        fullName: buyer.fullName,
        email: buyer.email,
      },
      freelancer: {
        id: gig.freelancerId,
        displayName: gig.freelancer.displayName,
        email: gig.freelancer.email,
      },
      gig: {
        id: gig.id,
        title: gig.title,
      },
      package: packageInfomation,
    };
  }

  // Create Stripe PaymentIntent
  private async createStripePaymentIntent(params: {
    orderId: string;
    buyerId: string;
    gigId: string;
    packageId: string;
    transactionId: string;
    totalAmount: number;
    currency: string;
  }) {
    return await this.stripeService.createPaymentIntent({
      amount: params.totalAmount,
      currency: params.currency,
      metadata: {
        orderId: params.orderId,
        buyerId: params.buyerId,
        gigId: params.gigId,
        packageId: params.packageId,
        transactionId: params.transactionId,
      },
    });
  }

  // Save Order, Transaction, Log in a Transaction
  private async saveOrderWithTransaction(
    createOrder: OrderEntity,
    orderTx: OrderTransactionEntity,
    createOrderLog: OrderLogsEntity,
    paymentUrl: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const finalCreateOrder = {
        ...createOrder,
        snapshot: {
          ...createOrder.snapshot,
          paymentUrl,
        },
      };

      const saveOrder = await queryRunner.manager.save(
        OrderEntity,
        finalCreateOrder,
      );
      const saveTransaction = await queryRunner.manager.save(
        OrderTransactionEntity,
        orderTx,
      );
      await queryRunner.manager.save(OrderLogsEntity, createOrderLog);

      await queryRunner.commitTransaction();

      return { saveOrder, saveTransaction };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      consoleError('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async createOrderOld(
    createDto: DeepPartial<OrderEntity>,
    currentUser: JwtAccessPayloadType,
  ): Promise<{
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

    const buyer = await this.userRepo.findOneBy({ id: String(buyerId) });
    if (!buyer) {
      consoleError(`Buyer with ID ${buyerId} not found`);
      throw new NotFoundException(`Buyer with ID ${buyerId} not found`);
    }

    const gigPackage = gig.packages.find((_) => _.id === packageId);

    if (!gigPackage) {
      consoleError(`Package with ID ${packageId} not found`);
      throw new NotFoundException(`Package with ID ${packageId} not found`);
    }

    const { price, deliveryTime } = gigPackage;

    const { createdAt, updatedAt, deletedAt, ...packageInfomation } =
      gigPackage;

    const snapshot = {
      buyer: {
        id: buyerId,
        fullName: buyer.fullName,
        email: buyer.email,
      },
      freelancer: {
        id: gig.freelancerId,
        displayName: gig.freelancer.displayName,
        email: gig.freelancer.email,
      },
      gig: {
        id: gig.id,
        title: gig.title,
      },
      package: packageInfomation,
    };

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
      status: OrderStatus.UNPAID,
      snapshot,
    });

    const orderTx = this.orderTransactionRepo.create({
      id: uuidv4(),
      //referenceCode: stripePaymentIntentId,
      amount: totalAmount,
      direction: TransactionDirection.IN,
      method: TransactionMethod.STRIPE,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      actorType: ActorType.BUYER,
      actor: buyer,
      orderId: createOrder.id,
      //metadata: stripePaymentIntent,
      currency,
    });

    const stripePaymentIntent = await this.stripeService.createPaymentIntent({
      amount: totalAmount,
      currency,
      metadata: {
        orderId: createOrder.id,
        buyerId,
        gigId,
        packageId,
        transactionId: orderTx.id,
      },
    });

    const { client_secret, id: stripePaymentIntentId } = stripePaymentIntent;

    orderTx.referenceCode = stripePaymentIntentId;
    orderTx.metadata = stripePaymentIntent;

    const paymentUrl = `?orderId=${createOrder.id}&transactionId=${orderTx.id}&clientSecret=${client_secret}&paymentIntentId=${stripePaymentIntentId}`;

    const createOrderLog = this.orderLogRepo.create({
      ...OrderActions.CREATE_ORDER,
      id: uuidv4(),
      actorId: currentUser.id,
      orderId: createOrder.id,
      metadata: {
        paymentUrl,
      },
    });

    const finalCreateOrder = {
      ...createOrder,
      snapshot: {
        ...createOrder.snapshot,
        paymentUrl,
      },
    };
    const saveOrder = await this._repository.save(finalCreateOrder);

    const saveTransaction = await this.orderTransactionRepo.save(orderTx);

    await this.orderLogRepo.save(createOrderLog);

    // const orderSave = await super.findOne({
    //   where: { id: saveOrder.id },
    //   relations: ['transactions', 'transactions.transactionStripe'],
    // });

    return {
      orderId: saveOrder.id,
      transactionId: saveTransaction.id,
      clientSecret: client_secret,
      paymentIntentId: stripePaymentIntentId,
    } as any;
  }

  async addQuestionsAnswersToOrder(
    data: OrderQuestionsEntity,
    currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsEntity> {
    const { orderId, question, answer, file } = data;

    const order = await super.findOneById(orderId);

    const createQuestionAnswer = this.orderQuestionsAnswersRepo.create({
      ...data,
      order,
    });

    return this.orderQuestionsAnswersRepo.save(createQuestionAnswer);
  }

  async addDeliveryWork(
    data: OrderDeliverablesEntity,
    currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    const { orderId } = data;

    const order = await super.findOneById(orderId);

    const freelancer = await this.freelancerRepo.findOne({
      where: { userId: currentUser.id },
    });

    if (!freelancer) {
      consoleError(`Freelancer with ID ${currentUser.id} not found`);
      throw new NotFoundException(
        `Freelancer with ID ${currentUser.id} not found`,
      );
    }

    const deliveryWork = this.orderDeliveryRepo.create({
      ...data,
      order,
      freelancer,
    });

    const log = this.orderLogRepo.create({
      order,
      actorId: currentUser.id,
      ...OrderActions.DELIVER_WORK,
    });

    await this.orderLogRepo.save(log);

    await this._repository.update(order.id, { status: OrderStatus.DELIVERED });

    return this.orderDeliveryRepo.save(deliveryWork);
  }

  async addReDeliveryWork(
    data: OrderDeliverablesEntity,
    currentUser: JwtAccessPayloadType,
  ): Promise<OrderDeliverablesEntity> {
    const { orderId } = data;

    const order = await super.findOneById(orderId);

    const freelancer = await this.freelancerRepo.findOne({
      where: { userId: currentUser.id },
    });

    if (!freelancer) {
      consoleError(`Freelancer with ID ${currentUser.id} not found`);
      throw new NotFoundException(
        `Freelancer with ID ${currentUser.id} not found`,
      );
    }

    const reDeliveryWork = this.orderDeliveryRepo.create({
      ...data,
      order,
      freelancer,
    });

    await this._repository.save({ ...order, status: OrderStatus.DELIVERED });

    const log = this.orderLogRepo.create({
      order,
      actorId: currentUser.id,
      ...OrderActions.RE_DELIVER_WORK,
    });

    await this.orderLogRepo.save(log);

    return this.orderDeliveryRepo.save(reDeliveryWork);
  }

  async updateQuestionsAnswersToOrder(
    data: OrderQuestionsEntity,
    currentUser: JwtAccessPayloadType,
  ): Promise<OrderQuestionsEntity> {
    const { id, answer, file } = data;

    const questionanswer = await this.orderQuestionsAnswersRepo.findOne({
      where: { id },
    });

    if (!questionanswer) {
      consoleError(`Entity with ID ${id} not found`);
      throw new NotFoundException(`ID ${id} not found`);
    }

    questionanswer.answer = answer;
    questionanswer.file = file;

    return this.orderQuestionsAnswersRepo.save(questionanswer);
  }

  getExpectedDate(deliveryTime: number): Date {
    const now = new Date();
    now.setDate(now.getDate() + deliveryTime);
    return now;
  }
  async updateOrderByAction(
    currentUser: JwtAccessPayloadType,
    id: BaseEntity['id'],
    data: DeepPartial<OrderEntity>,
  ): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepo = queryRunner.manager.getRepository(OrderEntity);
      const logRepo = queryRunner.manager.getRepository(OrderLogsEntity);

      const order = await orderRepo.findOneOrFail({
        where: { id: String(id) },
      });

      const ACTION_MAP = new Map<string, any>([
        [OrderActions.ACCEPT_ORDER.action, OrderActions.ACCEPT_ORDER],
        [OrderActions.START_WORK.action, OrderActions.START_WORK],
        [OrderActions.REQUEST_REVISION.action, OrderActions.REQUEST_REVISION],
        [OrderActions.COMPLETE_ORDER.action, OrderActions.COMPLETE_ORDER],
        [
          OrderActions.CANCEL_ORDER_BUYER.action,
          OrderActions.CANCEL_ORDER_BUYER,
        ],
        [
          OrderActions.CANCEL_ORDER_FREELANCER.action,
          OrderActions.CANCEL_ORDER_FREELANCER,
        ],
      ]);

      const actionData = ACTION_MAP.get(data.action!);

      if (!actionData) {
        throw new Error('Invalid action.');
      }

      // Kiểm tra điều kiện hủy đơn riêng biệt
      if (
        [
          OrderActions.CANCEL_ORDER_BUYER.action,
          OrderActions.CANCEL_ORDER_FREELANCER.action,
        ].includes(data.action! as any)
      ) {
        const cancellableStatuses = [
          OrderStatus.UNPAID,
          OrderStatus.PENDING,
          OrderStatus.ACCEPTED,
          OrderStatus.IN_PROGRESS,
        ];
        if (!cancellableStatuses.includes(order.status)) {
          throw new Error(
            `Only ${cancellableStatuses.join(', ')} orders can be canceled.`,
          );
        }
      } else {
        // Kiểm tra trạng thái chuyển tiếp hợp lệ
        if (order.status !== actionData.fromStatus) {
          throw new Error(
            `Only ${actionData.fromStatus} orders can be ${actionData.action}.`,
          );
        }
      }

      // Cập nhật trạng thái và ghi log
      const log = logRepo.create({
        order,
        actorId: currentUser.id,
        fromStatus:
          data.action === OrderActions.CANCEL_ORDER_BUYER.action ||
          data.action === OrderActions.CANCEL_ORDER_FREELANCER.action
            ? order.status
            : actionData.fromStatus,
        toStatus: actionData.toStatus,
        action: actionData.action,
        message: actionData.message,
        actorType: actionData.actorType,
      });

      order.status = actionData.toStatus;

      const updatedOrder = await orderRepo.save(order);
      await logRepo.save(log);

      await queryRunner.commitTransaction();
      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async refundToBuyer(id: String) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepo = queryRunner.manager.getRepository(OrderEntity);
      const logRepo = queryRunner.manager.getRepository(OrderLogsEntity);

      const order = await orderRepo.findOneOrFail({
        where: { id: String(id) },
      });

      await this.walletService.refundToBuyerWithTx(order, queryRunner);

      const refundOrderLog = logRepo.create({
        order,
        ...OrderActions.REFUND_ORDER,
        message: `Refund ${order.totalAmount} ${order.currency} for buyer.`,
      });

      order.status = OrderActions.REFUND_ORDER.toStatus;

      const updatedOrder = await orderRepo.save(order);
      await logRepo.save(refundOrderLog);

      await queryRunner.commitTransaction();

      return updatedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async addPendingEarningToFreelancer(id: String) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderRepo = queryRunner.manager.getRepository(OrderEntity);
      const logRepo = queryRunner.manager.getRepository(OrderLogsEntity);

      const order = await orderRepo.findOneOrFail({
        where: { id: String(id) },
      });

      await this.walletService.addPendingEarningWithTx(order, queryRunner);

      await queryRunner.commitTransaction();

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrderByActionOld(
    currentUser: JwtAccessPayloadType,
    id: BaseEntity['id'],
    data: DeepPartial<OrderEntity>,
  ): Promise<OrderEntity> {
    const order = await this.findOneById(id);

    let log = this.orderLogRepo.create({
      order,
      actorId: currentUser.id,
    });

    switch (data.action) {
      case OrderActions.ACCEPT_ORDER.action:
        if (order.status !== OrderActions.ACCEPT_ORDER.fromStatus) {
          throw new Error(
            `Only ${OrderActions.ACCEPT_ORDER.fromStatus} orders can be completed.`,
          );
        }

        order.status = OrderActions.ACCEPT_ORDER.toStatus;
        log = { ...log, ...OrderActions.ACCEPT_ORDER };
        break;

      case OrderActions.START_WORK.action:
        if (order.status !== OrderActions.START_WORK.fromStatus) {
          throw new Error(
            `Only ${OrderActions.START_WORK.fromStatus} orders can be completed.`,
          );
        }

        order.status = OrderActions.START_WORK.toStatus;
        log = { ...log, ...OrderActions.START_WORK };
        break;

      case OrderActions.REQUEST_REVISION.action:
        if (order.status !== OrderActions.REQUEST_REVISION.fromStatus) {
          throw new Error(
            `Only ${OrderActions.REQUEST_REVISION.fromStatus} orders can be completed.`,
          );
        }

        order.status = OrderActions.REQUEST_REVISION.toStatus;
        log = { ...log, ...OrderActions.REQUEST_REVISION };
        break;

      case OrderActions.COMPLETE_ORDER.action:
        if (order.status !== OrderActions.COMPLETE_ORDER.fromStatus) {
          throw new Error(
            `Only ${OrderActions.COMPLETE_ORDER.fromStatus} orders can be completed.`,
          );
        }
        order.status = OrderActions.COMPLETE_ORDER.toStatus;
        log = { ...log, ...OrderActions.COMPLETE_ORDER };
        break;

      case OrderActions.CANCEL_ORDER_BUYER.action:
        if (
          order.status !== OrderStatus.UNPAID &&
          order.status !== OrderStatus.PENDING &&
          order.status !== OrderStatus.ACCEPTED &&
          order.status !== OrderStatus.IN_PROGRESS
        ) {
          throw new Error(
            `Only ${OrderStatus.UNPAID}, ${OrderStatus.PENDING},${OrderStatus.ACCEPTED},${OrderStatus.IN_PROGRESS} orders can be canceled.`,
          );
        }

        log = {
          ...log,
          fromStatus: order.status,
          ...OrderActions.CANCEL_ORDER_BUYER,
        };

        order.status = OrderActions.CANCEL_ORDER_BUYER.toStatus;
        break;

      case OrderActions.CANCEL_ORDER_FREELANCER.action:
        if (
          order.status !== OrderStatus.UNPAID &&
          order.status !== OrderStatus.PENDING &&
          order.status !== OrderStatus.ACCEPTED &&
          order.status !== OrderStatus.IN_PROGRESS
        ) {
          throw new Error(
            `Only ${OrderStatus.UNPAID}, ${OrderStatus.PENDING},${OrderStatus.ACCEPTED},${OrderStatus.IN_PROGRESS} orders can be canceled.`,
          );
        }

        log = {
          ...log,
          fromStatus: order.status,
          ...OrderActions.CANCEL_ORDER_FREELANCER,
        };

        order.status = OrderActions.CANCEL_ORDER_FREELANCER.toStatus;
        break;

      default:
        break;
    }

    try {
      const updatedOrder = await this._repository.save(order);

      await this.orderLogRepo.save(log);

      return updatedOrder;
    } catch (error) {
      console.error('Error updating entity:', error);
      throw new ConflictException('Update failed due to conflict');
    }
  }

  async completeOrder(
    currentUser: JwtAccessPayloadType,
    orderId: string,
    queryRunner: QueryRunner,
  ) {
    const order = await queryRunner.manager.findOne(OrderEntity, {
      where: { id: orderId },
    });

    if (!order) {
      throw new Error('Order not found.');
    }

    order.status = OrderActions.COMPLETE_ORDER.toStatus;

    order.status = OrderActions.CANCEL_ORDER_FREELANCER.toStatus;

    const updatedOrder = await queryRunner.manager.save(order);

    await this.walletService.addPendingEarningToFreelancer(updatedOrder);

    return updatedOrder;
  }

  protected async modifyOptions(
    options: FindManyOptions<OrderEntity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<FindManyOptions<OrderEntity>> {
    if (currentUser?.role.toLocaleLowerCase() === 'freelancer') {
      // const freelancer = await this.freelancerRepo.findOne({
      //   where: { userId: currentUser.id },
      //   select: { id: true },
      // });

      options.where = {
        ...options.where,
        freelancerId: currentUser?.freelancerId,
      //  status: Not(In([OrderStatus.UNPAID])),
      };
    }

    if (currentUser?.role.toLocaleLowerCase() === 'buyer') {
      options.where = {
        ...options.where,
        buyerId: currentUser?.id,
      };
    }

    return options;
  }

  async mappingOrderWithBuyer(results: any) {
    const { data } = results;
    const buyerIds = new Set(data.map((item) => item.buyerId));
    const buyers = await this.userRepo.find({
      where: {
        id: In(buyerIds as any),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        avatar: true,
      },
    });
    const buyerMap = new Map(buyers.map((buyer) => [buyer.id, buyer]));

    for (const order of data) {
      const buyer = buyerMap.get(order.buyerId);
      if (buyer) {
        order.buyer = buyer;
      }
    }
    results.data = data.map((item) => {
      const { buyer, ...finalItem } = item;
      return {
        ...finalItem,
        buyer: {
          id: buyer.id,
          name: buyer.name,
          email: buyer.email,
          avatar: buyer.avatar,
        },
      };
    });

    return data;
  }

  private generateOrderNo(): string {
    let prefix = 'ORD';

    return `${prefix}-${new Date()
      .toISOString()
      .replace(/[-:T.]/g, '')
      .slice(0, 14)}-${nanoid(12)}`;
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

  //   @Cron(CronExpression.EVERY_30_MINUTES)
  //   async handleExpiredOrders() {
  //     // pseudo code
  // const cancelledOrders = await Order.find({
  //   status: 'cancelled',
  //   isRefunded: false,
  // });

  // for (const order of cancelledOrders) {
  //   const payment = await Payment.findOne({ orderId: order.id, status: 'paid' });
  //   if (!payment) continue;

  //   await UserTransaction.create({
  //     userId: order.buyerId,
  //     type: 'refund',
  //     amount: payment.amount,
  //     status: 'completed',
  //     description: `Refund for cancelled order #${order.id}`,
  //     orderId: order.id,
  //   });

  //   await UserWallet.increment({ userId: order.buyerId }, payment.amount);

  //   await Order.update({ id: order.id }, { isRefunded: true });
  //   }
}
