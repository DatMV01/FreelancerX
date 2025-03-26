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
import { OrderDetailEntity } from 'src/modules/orderdetail/entities/orderdetail.entity';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => UserEntity)
  @ManyToOne(() => UserEntity, (user) => user.buyerorders)
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.orders)
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.orders)
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @AutoMap(() => OrderDetailEntity)
  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];

  @AutoMap(() => PaymentEntity)
  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];

  @Column()
  totalAmount: number;
}
