import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  AfterLoad,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderTransactionEntity } from 'src/modules/order/entities/order_transactions.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';
import { OrderLogsEntity } from './order_logs.entity';
import { GigPackagesEntity } from 'src/modules/gig/entities/gig_packages.entity';
import { OrderQuestionsEntity } from './order_questions.entity';
import { OrderDeliverablesEntity } from './order_deliverables.entity';
import { OrderStatus } from '../enum/order.enum';
import { GigRatingEntity } from 'src/modules/gig_rating/entities/gigreview.entity';
 
@Entity('orders')
export class OrderEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column()
  @Index()
  orderNo: string;

  /* BUYER */
  @AutoMap()
  @Column({ name: 'buyer_id', nullable: true })
  buyerId: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.buyerorders, {
    onDelete: 'SET NULL', // Nếu user bị xóa, đơn hàng vẫn tồn tại nhưng buyer_id sẽ thành NULL
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  /* FREELANCER */
  @AutoMap()
  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId: string;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.orders, {
    onDelete: 'SET NULL', // Freelancer bị xóa, order vẫn còn
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /* GIG */
  @AutoMap()
  @Column({ name: 'gig_id', nullable: true })
  gigId: string;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.orders, {
    onDelete: 'SET NULL', // Gig bị xóa, order vẫn còn nhưng gig_id thành NULL
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  /* PACKAGE */
  @AutoMap()
  @Column({ name: 'package_id', nullable: true })
  packageId: string;

  @AutoMap(() => GigPackagesEntity)
  @ManyToOne(() => GigPackagesEntity, (_) => _.orders, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'package_id' })
  package: GigPackagesEntity;

  @AutoMap()
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @AutoMap()
  @Column('int')
  price: number;

  @AutoMap()
  @Column('int')
  quantity: number;

  @AutoMap()
  @Column('int')
  totalAmount: number;

  // @AutoMap()
  // @Column('json', { nullable: true })
  // requirements: any; // info bổ sung nếu cần

  @AutoMap()
  @Column()
  deliveryTime: number; // days

  // @AutoMap(() => Date)
  // expectedDeliveryDate: Date;

  @AutoMap()
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @AutoMap(() => Object)
  @Column({ type: 'json', nullable: true })
  snapshot: object;

  // @AutoMap(() => TransactionEntity)
  // @OneToOne(() => TransactionEntity, (transaction) => transaction.order, {
  //   cascade: true,
  //   eager: true,
  // })
  // @JoinColumn()
  // transaction: TransactionEntity;

  @AutoMap(() => [OrderTransactionEntity])
  @OneToMany(() => OrderTransactionEntity, (transaction) => transaction.order, {
    //   eager: true,
  })
  transactions: OrderTransactionEntity[];

  @AutoMap(() => [OrderLogsEntity])
  @OneToMany(() => OrderLogsEntity, (_) => _.order, {
    eager: true,
  })
  orderlogs: OrderLogsEntity[];

  @AutoMap(() => [OrderQuestionsEntity])
  @OneToMany(() => OrderQuestionsEntity, (_) => _.order, {
    eager: true,
  })
  orderQuestionsAnswers: OrderQuestionsEntity[];

  @AutoMap(() => [OrderDeliverablesEntity])
  @OneToMany(() => OrderDeliverablesEntity, (_) => _.order, {
    eager: true,
  })
  deliverables: OrderDeliverablesEntity[];

  @AutoMap(() => GigRatingEntity)
  @OneToOne(() => GigRatingEntity, { eager: false })
  rating: GigRatingEntity;

  @AutoMap(() => Date)
  @Column({ nullable: true })
  startDate: Date;

  @AutoMap(() => Date)
  @Column({ nullable: true })
  endDate: Date;

  @AutoMap()
  action: string;

  // @AfterLoad()
  // afterLoad() {
  //   if (this.startDate) {
  //     const result = new Date(this.startDate);
  //     result.setDate(result.getDate() + this.deliveryTime);
  //     this.endDate = result;
  //   }
  // }
}
