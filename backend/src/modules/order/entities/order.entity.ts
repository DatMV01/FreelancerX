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
  @ManyToOne(() => UserEntity, (user) => user.buyerorders, {
    onDelete: 'SET NULL', // Nếu user bị xóa, đơn hàng vẫn tồn tại nhưng buyer_id sẽ thành NULL
    nullable: true,
  })
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @AutoMap(() => FreelancerEntity)
  @ManyToOne(() => FreelancerEntity, (freelancer) => freelancer.orders, {
    onDelete: 'SET NULL', // Freelancer bị xóa, order vẫn còn
    nullable: true,
  })
  @JoinColumn({ name: 'freelancer_id' })
  freelancer: FreelancerEntity;

  @AutoMap(() => GigEntity)
  @ManyToOne(() => GigEntity, (gig) => gig.orders, {
    onDelete: 'SET NULL', // Gig bị xóa, order vẫn còn nhưng gig_id thành NULL
    nullable: true,
  })
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  // @AutoMap(() => OrderDetailEntity)
  // @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order, {
  //   cascade: true, // Khi xóa order, các orderDetail liên quan cũng bị xóa
  // })
  // orderDetails: OrderDetailEntity[];

  @AutoMap(() => PaymentEntity)
  @OneToMany(() => PaymentEntity, (payment) => payment.order, {
    cascade: true, // Khi xóa order, các payment liên quan cũng bị xóa
  })
  payments: PaymentEntity[];

  @Column()
  totalAmount: number;

  @AutoMap()
  @Column()
  quantity: number;

  @AutoMap()
  @Column()
  price: number;
}
