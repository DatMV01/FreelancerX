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
import { AutoMap } from '@automapper/classes';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod; // e.g., Credit Card, PayPal, etc.

  @AutoMap()
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus; // e.g., Pending, Completed

  @AutoMap()
  @Column()
  paymentAmount: number;

  @AutoMap(() => Date)
  @Column()
  paymentDate: Date;
}
