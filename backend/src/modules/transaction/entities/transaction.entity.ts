import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';
import { WithdrawalRequest } from './withdrawalRequest.entity';

@Entity('transaction')
export class TransactionEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    nullable: true,
    onDelete: 'RESTRICT', // NGĂN CHẶN việc xóa Order nếu có Transaction liên quan
  })
  user: UserEntity;

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

  // ✅ Liên kết với Order (nếu có)
  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    nullable: true,
    onDelete: 'RESTRICT', // NGĂN CHẶN việc xóa Order nếu có Transaction liên quan
  })
  order?: OrderEntity;

  // ✅ Liên kết với WithdrawalRequest (nếu có)
  @ManyToOne(() => WithdrawalRequest, { nullable: true, onDelete: 'RESTRICT' })
  withdrawalRequest?: WithdrawalRequest;

  @Column('json', { nullable: true })
  rawData: any; // lưu raw response từ Stripe/VNPAY

  @Column({ nullable: true })
  @Column({
    type: 'enum',
    enum: ['stripe', 'vnpay', 'paypal'],
    default: 'stripe',
  })
  provider: 'stripe' | 'vnpay' | 'paypal';

  @Column({ nullable: true })
  transactionRef?: string; // mã giao dịch từ Stripe/VNPAY
}
