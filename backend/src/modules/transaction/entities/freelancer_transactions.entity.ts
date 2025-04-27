import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
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
} from '../enum/transaction.enum';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity('freelancer_transactions')
export class FreelancerTransactionEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
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

  @Column({
    name: 'freelancer_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  @Index()
  freelancerId: string;

  @ManyToOne(() => FreelancerEntity, (_) => _.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  // Liên kết với Order (nếu có)
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'order_id', nullable: true })
  orderId?: string;

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity)
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Lưu thêm info như Stripe session, bank ref...

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;
}
