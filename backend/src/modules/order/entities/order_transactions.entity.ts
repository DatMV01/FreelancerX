import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  ActorType,
  TransactionDirection,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from '../../wallet/enum/transaction.enum';

@Entity('order_transactions')
export class OrderTransactionEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  referenceCode: string; // Mã tham chiếu duy nhất của giao dịch

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number; // Số tiền giao dịch

  @Column({ type: 'enum', enum: TransactionDirection })
  direction: TransactionDirection; // 'in' or 'out'

  @Column({ nullable: true })
  method?: TransactionMethod; // e.g., 'bank', 'paypal', 'momo', 'stripe

  @AutoMap()
  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  type: TransactionType;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
    nullable: false,
  })
  status: TransactionStatus;

  // Actor
  @AutoMap()
  @Column({ type: 'enum', enum: ActorType })
  actorType: ActorType; // Freelancer or Buyer

  @AutoMap()
  @Index()
  @Column({ type: 'char', length: 36, name: 'actor_id', nullable: false })
  actorId: string; // Refer to Freelancer or Buyer ID

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'actor_id' })
  actor?: UserEntity;

  // Liên kết với Order (nếu có)
  @AutoMap()
  @Index()
  @Column({ type: 'char', length: 36, name: 'order_id', nullable: true })
  orderId?: string;

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Lưu thêm info như Stripe session, bank ref...

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
