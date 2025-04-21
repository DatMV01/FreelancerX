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
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OrderStatus } from '../order.enum';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { IsOptional } from 'class-validator';

const orderLogs = [
  {
    id: 'log-1',
    orderId: 'order-123',
    action: 'CREATE_ORDER',
    fromStatus: null,
    toStatus: 'UNPAID',
    userId: 'buyer-001',
    userRole: 'BUYER',
    message: 'Buyer created the order.',
    createdAt: '2025-04-19T10:00:00Z',
  },
  {
    id: 'log-2',
    orderId: 'order-123',
    action: 'PAY_ORDER',
    fromStatus: 'UNPAID',
    toStatus: 'PENDING',
    userId: 'buyer-001',
    userRole: 'BUYER',
    message: 'Buyer paid the order. Waiting for freelancer to accept.',
    createdAt: '2025-04-19T10:05:00Z',
  },
  {
    id: 'log-3',
    orderId: 'order-123',
    action: 'ACCEPT_ORDER',
    fromStatus: 'PENDING',
    toStatus: 'ACCEPTED',
    userId: 'freelancer-001',
    userRole: 'FREELANCER',
    message: 'Freelancer accepted the order.',
    createdAt: '2025-04-19T10:15:00Z',
  },
  {
    id: 'log-4',
    orderId: 'order-123',
    action: 'START_WORK',
    fromStatus: 'ACCEPTED',
    toStatus: 'IN_PROGRESS',
    userId: 'freelancer-001',
    userRole: 'FREELANCER',
    message: 'Freelancer started working on the order.',
    createdAt: '2025-04-19T10:30:00Z',
  },
  {
    id: 'log-5',
    orderId: 'order-123',
    action: 'DELIVER_WORK',
    fromStatus: 'IN_PROGRESS',
    toStatus: 'DELIVERED',
    userId: 'freelancer-001',
    userRole: 'FREELANCER',
    message: 'Freelancer delivered the work.',
    createdAt: '2025-04-19T12:00:00Z',
  },
  {
    id: 'log-6',
    orderId: 'order-123',
    action: 'REQUEST_REVISION',
    fromStatus: 'DELIVERED',
    toStatus: 'REVISION_REQUESTED',
    userId: 'buyer-001',
    userRole: 'BUYER',
    message: 'Buyer requested a revision.',
    createdAt: '2025-04-19T13:00:00Z',
  },
  {
    id: 'log-7',
    orderId: 'order-123',
    action: 'RE_DELIVER_WORK',
    fromStatus: 'REVISION_REQUESTED',
    toStatus: 'DELIVERED',
    userId: 'freelancer-001',
    userRole: 'FREELANCER',
    message: 'Freelancer re-delivered the work.',
    createdAt: '2025-04-19T15:00:00Z',
  },
  {
    id: 'log-8',
    orderId: 'order-123',
    action: 'COMPLETE_ORDER',
    fromStatus: 'DELIVERED',
    toStatus: 'COMPLETED',
    userId: 'buyer-001',
    userRole: 'BUYER',
    message: 'Buyer marked the order as completed.',
    createdAt: '2025-04-19T18:00:00Z',
  },
  {
    id: 'log-9',
    orderId: 'order-124',
    action: 'CANCEL_ORDER',
    fromStatus: 'PENDING',
    toStatus: 'CANCEL',
    userId: 'buyer-002',
    userRole: 'BUYER',
    message: 'Buyer canceled the order.',
    createdAt: '2025-04-19T11:00:00Z',
  },
];

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
  @IsOptional()
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderlogs)
  @JoinColumn({ name: 'order_id' })
  @IsOptional()
  order: OrderEntity;

  @AutoMap()
  @Column({ type: 'enum', enum: OrderStatus, nullable: true, default: null })
  @IsOptional()
  fromStatus: OrderStatus;

  @Column({ type: 'enum', enum: OrderStatus, nullable: true, default: null })
  @IsOptional()
  toStatus: OrderStatus;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  action: string;

  @Column({ type: 'nvarchar', nullable: true })
  @IsOptional()
  actor: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  message: string;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  metadata: any;

  @AutoMap()
  @IsOptional()
  @Column({
    name: 'user_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  userId: string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  @IsOptional()
  user: UserEntity;

  @AutoMap(() => Date)
  @CreateDateColumn()
  @IsOptional()
  createdAt: Date;
}
