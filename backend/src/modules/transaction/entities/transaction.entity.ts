import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WithdrawalEntity } from './withdrawalRequest.entity';
import { TransactionStripeEntity } from './transactionStripe.entity';

export enum TransactionProvider {
  STRIPE = 'STRIPE',
  VNPAY = 'VNPAY',
  PAYPAL = 'PAYPAL',
  MOMO = 'MOMO',
  MANUAL = 'MANUAL',
  TOP_UP = 'TOP_UP',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  EARNING = 'EARNING',
  PLATFORM_FEE = 'PLATFORM_FEE',
}

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  // ✅ Liên kết với Order (nếu có)
  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'order_id', nullable: true })
  orderId?: string;

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_id' })
  order?: OrderEntity;

  // ✅ Liên kết với WithdrawalRequest (nếu có)
  @AutoMap(() => WithdrawalEntity)
  @OneToOne(() => WithdrawalEntity, (_) => _.transaction)
  withdrawal?: WithdrawalEntity;

  @OneToOne(() => TransactionStripeEntity, (_) => _.transaction)
  @AutoMap(() => TransactionStripeEntity)
  transactionStripe?: TransactionStripeEntity;

  @AutoMap()
  @Column('int')
  amount: number;

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

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionProvider,
    nullable: false,
    default: TransactionProvider.STRIPE,
  })
  provider: TransactionProvider;

  @AutoMap()
  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;
}
