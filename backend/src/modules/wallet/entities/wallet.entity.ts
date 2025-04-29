import { AutoMap } from '@automapper/classes';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WalletTransactionEntity } from './wallet_transactions.entity';

@Entity('wallet')
export class WalletEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    nullable: false,
    type: 'char',
    length: 36,
  })
  userId: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: 0 })
  availableBalance: number;

  @Column({ type: 'varchar', length: 5, default: 'USD' })
  currency: string;

  @AutoMap(() => [WalletTransactionEntity])
  @OneToMany(() => WalletTransactionEntity, (_) => _.wallet)
  transactions: WalletTransactionEntity[];

  @CreateDateColumn()
  createdAt: Date;
}
