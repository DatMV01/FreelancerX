import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order.status';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';
import { OrderItem } from './orderItem.entity';
import { GigReviewEntity } from 'src/modules/gigreview/entities/gigreview.entity';

@Entity('order')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column('int')
  totalAmount: number; // in cents

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.UNPAID })
  status: OrderStatus;

  @Column({ type: 'varchar', nullable: true })
  paymentMethod: 'stripe' | 'vnpay' | 'paypal' | null;

  @Column({ type: 'varchar', nullable: true })
  paymentIntentId: string;

  @Column({ type: 'varchar', nullable: true })
  checkoutSessionId: string;

  @AutoMap(() => PaymentEntity)
  @OneToMany(() => PaymentEntity, (payment) => payment.order, {
    cascade: true, // Khi xóa order, các payment liên quan cũng bị xóa
  })
  payments: PaymentEntity[];

  @OneToMany(() => GigReviewEntity, (review) => review.gig)
  reviews: GigReviewEntity[];

  @AutoMap(() => [TransactionEntity])
  @OneToMany(() => TransactionEntity, (transaction) => transaction.order, {
    onDelete: 'RESTRICT', // NGĂN CHẶN việc xóa Order nếu có Transaction liên quan
  })
  transactions: TransactionEntity[];

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @OneToOne(() => GigReviewEntity)
  review: GigReviewEntity;
}
