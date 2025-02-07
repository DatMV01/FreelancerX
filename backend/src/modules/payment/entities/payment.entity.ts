import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { PaymentStatus } from '../enum/payment.status';
import { PaymentMethod } from '../enum/payment.method';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod; // e.g., Credit Card, PayPal, etc.

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus; // e.g., Pending, Completed

  @Column()
  paymentAmount: number;

  @Column()
  paymentDate: Date;
}
