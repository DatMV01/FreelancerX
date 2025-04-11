import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionEntity } from './transaction.entity';

@Entity('freelancer_widthdrawals')
export class WithdrawalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => FreelancerEntity, (user) => user.withdrawals)
  user: FreelancerEntity;

  @Column('int')
  amount: number;

  @Column({
    type: 'enum',
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  payoutMethod?: string; // e.g., 'bank', 'paypal', 'momo', 'stripe'

  @Column({ nullable: true })
  payoutDetails?: string; // e.g., bank account info, email, etc.

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  processedAt?: Date;

  @OneToOne(() => TransactionEntity, (txn) => txn.withdrawal, {
    nullable: false,
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction?: TransactionEntity;
}
