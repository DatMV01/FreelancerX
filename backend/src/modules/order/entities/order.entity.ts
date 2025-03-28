import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enum/order.status';
import { TransactionEntity } from 'src/modules/transaction/entities/transaction.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /* BUYER */
  @AutoMap()
  @Column({ name: 'buyer_id', nullable: true })
  buyerId: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.buyerorders, {
    onDelete: 'SET NULL', // Nếu user bị xóa, đơn hàng vẫn tồn tại nhưng buyer_id sẽ thành NULL
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  /* FREELANCER */
  @AutoMap()
  @Column({ name: 'freelancer_id', nullable: true })
  freelancerId: string;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.orders, {
    onDelete: 'SET NULL', // Freelancer bị xóa, order vẫn còn
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  /* GIG */
  @AutoMap()
  @Column({ name: 'gig_id', nullable: true })
  gigId: string;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.orders, {
    onDelete: 'SET NULL', // Gig bị xóa, order vẫn còn nhưng gig_id thành NULL
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @AutoMap(() => PaymentEntity)
  @OneToMany(() => PaymentEntity, (payment) => payment.order, {
    cascade: true, // Khi xóa order, các payment liên quan cũng bị xóa
  })
  payments: PaymentEntity[];

  @AutoMap(() => [TransactionEntity])
  @OneToMany(() => TransactionEntity, (transaction) => transaction.order, {
    onDelete: 'RESTRICT', // NGĂN CHẶN việc xóa Order nếu có Transaction liên quan
  })
  transactions: TransactionEntity[];

  /* OTHER FIELDS */
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @AutoMap()
  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @AutoMap()
  @Column({ type: 'bigint' })
  price: number;
}
