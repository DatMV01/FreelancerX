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
  FindOptionsOrder,
  FindOptionsWhere,
  In,
  LessThan,
  Repository,
} from 'typeorm';
import { BaseService } from '../base/base.service';
import { OrderEntity } from './entities/order.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v4 as uuidv4 } from 'uuid';

import { StripeService } from 'src/stripe/stripe.service';
import { GigEntity } from '../gig/entities/gig.entity';
import { GigService } from '../gig/gig.service';
import { consoleError } from 'src/utils/common';
import { OrderLogsEntity } from './entities/order_logs.entity';
import { OrderQuestionsEntity } from './entities/order_questions.entity';
import { JwtAccessPayloadType } from '../auth/strategies/types/jwt-access-payload.type';
import { UserEntity } from '../user/entities/user.entity';
import { FreelancerEntity } from '../freelancer/entities/freelancer.entity';
import { BaseEntity } from '../base/entities/base.entity';
import { OrderActions, OrderStatus } from './order.enum';
import { OrderDeliverablesEntity } from './entities/order_deliverables.entity';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import {
  ActorType,
  TransactionDirection,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from '../transaction/enum/transaction.enum';

@Injectable()
export class OrderService extends BaseService<OrderEntity> {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly _repository: Repository<OrderEntity>,

    @InjectRepository(GigEntity)
    private gigRepo: Repository<GigEntity>,

    @InjectRepository(TransactionEntity)
    private transactionRepo: Repository<TransactionEntity>,

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

    private stripeService: StripeService,
  ) {
    super(_repository);
  }

  // async findOneById(id: BaseEntity['id']): Promise<OrderEntity> {
  //   const _ = await super.findOneById(id);
  //   const logs = await this.orderLogRepo.findBy({ orderId: String(id) });
  //   _.orderlogs = logs;

  //   return _;
  // }

  async createOrder(
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

    const stripePaymentIntent = await this.stripeService.createPaymentIntent({
      amount: totalAmount,
      currency,
      metadata: {
        orderId: createOrder.id,
        buyerId,
        gigId,
        packageId,
      },
    });

    const { client_secret, id: stripePaymentIntentId } = stripePaymentIntent;

    const createTransaction = this.transactionRepo.create({
      id: uuidv4(),
      referenceCode: stripePaymentIntentId,
      amount: totalAmount,
      direction: TransactionDirection.IN,
      method: TransactionMethod.STRIPE,
      type: TransactionType.PAYMENT,
      status: TransactionStatus.PENDING,
      actorType: ActorType.BUYER,
      actor: buyer,
      orderId: createOrder.id,
      metadata: stripePaymentIntent,
      currency,
    });

    const paymentUrl = `?orderId=${createOrder.id}&transactionId=${createTransaction.id}&clientSecret=${client_secret}&paymentIntentId=${stripePaymentIntentId}`;

    const createOrderLog = this.orderLogRepo.create({
      ...OrderActions.CREATE_ORDER,
      id: uuidv4(),
      userId: currentUser.id,
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

    const saveTransaction = await this.transactionRepo.save(createTransaction);

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

    const createQuestionAnswer = this.orderDeliveryRepo.create({
      ...data,
      order,
      freelancer,
    });

    await this._repository.save({ ...order, status: OrderStatus.DELIVERED });
    return this.orderDeliveryRepo.save(createQuestionAnswer);
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

    const createQuestionAnswer = this.orderDeliveryRepo.create({
      ...data,
      order,
      freelancer,
    });

    await this._repository.save({ ...order, status: OrderStatus.DELIVERED });
    const log = this.orderLogRepo.create({
      ...OrderActions.RE_DELIVER_WORK,

      orderId: order.id,
      userId: currentUser.id,
    } as any);
    await this.orderLogRepo.save(log);

    return this.orderDeliveryRepo.save(createQuestionAnswer);
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

  async update(
    id: BaseEntity['id'],
    data: DeepPartial<OrderEntity>,
  ): Promise<OrderEntity> {
    const entity = await this._repository.preload({ id: String(id), ...data });

    if (!entity) {
      consoleError(`Entity with ID ${id} not found`);
      throw new NotFoundException(`ID ${id} not found`);
    }

    // if (data.status === OrderStatus.CANCEL) {
    //   await this.orderLogRepo.save({
    //     actor:
    //       data.buyerId === 'true'
    //         ? OrderActor.BUYER
    //         : data.freelancerId === 'true'
    //           ? OrderActor.FREELANCER
    //           : OrderActor.ADMIN,
    //     detail: OrderAction.CANCELLED,
    //     orderId: entity.id,
    //   });
    // }

    // if (
    //   data.status === OrderStatus.IN_PROGRESS &&
    //   entity.status === OrderStatus.PENDING
    // ) {
    //   entity.startDate = new Date(Date.now());
    // }

    try {
      return await this._repository.save(entity);
    } catch (error) {
      console.error('Error updating entity:', error);
      throw new ConflictException('Update failed due to conflict');
    }
  }

  // async update(
  //   id: BaseEntity['id'],
  //   data: DeepPartial<Entity>,
  // ): Promise<Entity> {
  //   const entity = await this.repository.preload({ id, ...data });

  //   if (!entity) {
  //     consoleError(`Entity with ID ${id} not found`);
  //     throw new NotFoundException(`ID ${id} not found`);
  //   }

  //   try {
  //     return await this.repository.save(entity);
  //   } catch (error) {
  //     console.error('Error updating entity:', error);
  //     throw new ConflictException('Update failed due to conflict');
  //   }
  // }

  protected async modifyOptions(
    options: FindManyOptions<OrderEntity>,
    currentUser?: JwtAccessPayloadType,
  ): Promise<FindManyOptions<OrderEntity>> {
    if (currentUser?.role.toLocaleLowerCase() === 'freelancer') {
      const freelancer = await this.freelancerRepo.findOne({
        where: { userId: currentUser.id },
        select: { id: true },
      });

      options.where = {
        ...options.where,
        freelancerId: freelancer?.id,
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
