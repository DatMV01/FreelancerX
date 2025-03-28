import { AutoMap } from '@automapper/classes';
import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionStatus, TransactionType } from '../enum/transaction.enum';

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

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.transactions, {
    nullable: true,
    onDelete: 'RESTRICT', // NGĂN CHẶN việc xóa Order nếu có Transaction liên quan
  })
  order?: OrderEntity;

  @AutoMap()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @AutoMap()
  @Column({ type: 'enum', enum: TransactionType, nullable: false })
  transactionType: TransactionType;

  @AutoMap()
  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
    nullable: false,
  })
  status: TransactionStatus;
}
