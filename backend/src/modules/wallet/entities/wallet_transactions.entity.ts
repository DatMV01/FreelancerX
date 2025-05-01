import { AutoMap } from '@automapper/classes';
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
import { WalletEntity } from './wallet.entity';

@Entity('wallet_transactions')
export class WalletTransactionEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'wallet_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  @Index()
  walletId: string;

  @ManyToOne(() => WalletEntity, (_) => _.transactions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wallet_id' })
  wallet: WalletEntity;

  @AutoMap()
  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  // Actor

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
    nullable: false,
  })
  status: TransactionStatus;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  amount: number;

  @AutoMap()
  @Column({ type: 'enum', enum: ActorType })
  actorType: ActorType; // Freelancer or Buyer

  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'actor_id', nullable: true })
  actorId: string; // Refer to Freelancer or Buyer ID

  @Column({ type: 'varchar', length: 100, unique: true, nullable: true })
  referenceCode: string; // order id, withdraw id

  @Column('decimal', { precision: 20, scale: 8 })
  balanceBefore: number;

  @Column('decimal', { precision: 20, scale: 8 })
  balanceAfter: number;

  // @AutoMap()
  // @Column({ type: 'enum', enum: TransactionDirection })
  // direction: TransactionDirection;

  @Column({ nullable: true })
  method?: TransactionMethod; // e.g., 'bank', 'paypal', 'momo', 'stripe

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Lưu thêm info như Stripe session, bank ref...

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 5, default: 'USD' })
  currency: string;

  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @AutoMap(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date | null;

  @Column({ type: 'char', length: 36, nullable: true })
  processedBy: string | null;
}
