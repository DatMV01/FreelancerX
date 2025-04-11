import { BaseEntity } from 'src/modules/base/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { AutoMap } from '@automapper/classes';

export enum OrderAction {
  ORDER_CREATED = 'ORDER_CREATED',
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  SELLER_ASSIGNED = 'SELLER_ASSIGNED',
  REQUIREMENTS_SUBMITTED = 'REQUIREMENTS_SUBMITTED',
  ORDER_STARTED = 'ORDER_STARTED',
  DRAFT_DELIVERED = 'DRAFT_DELIVERED',
  REVISION_REQUESTED = 'REVISION_REQUESTED',
  FINAL_DELIVERED = 'FINAL_DELIVERED',
  ORDER_COMPLETED = 'ORDER_COMPLETED',
  REVIEW_SUBMITTED = 'REVIEW_SUBMITTED',
  CANCELLED = 'CANCELLED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
}

export enum OrderActor {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  SYSTEM = 'SYSTEM',
  ADMIN = 'ADMIN',
}

@Entity('order_logs')
export class OrderLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({
    name: 'order_id',
    type: 'char',
    length: 36,
  })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderlogs)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ type: 'enum', enum: OrderAction })
  action: OrderAction;

  @Column({ type: 'enum', enum: OrderActor })
  actor: OrderActor;

  @Column()
  detail: string;

  @Column({ type: 'json', nullable: true })
  metadata: any;

  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
