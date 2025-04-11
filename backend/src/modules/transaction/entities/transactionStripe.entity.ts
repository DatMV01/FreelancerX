import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionEntity } from './transaction.entity';
import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';

@Entity('transaction_stripe')
export class TransactionStripeEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @Column({ type: 'char', length: 36, name: 'transaction_id', nullable: false })
  transactionId?: string;

  @AutoMap()
  @OneToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity;

  @Column({ nullable: false })
  paymentIntentId: string;

  @Column({ nullable: false })
  clientSecret: string;
}
