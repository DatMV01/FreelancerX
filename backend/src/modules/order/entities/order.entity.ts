import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { GigEntity } from 'src/modules/gig/entities/gig.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
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
import { SellerEntity } from 'src/modules/seller/entities/seller.entity';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.buyerorders)
  @JoinColumn({ name: 'buyer_id' })
  buyer: UserEntity;

  @ManyToOne(() => SellerEntity, (user) => user.sellerOrders)
  @JoinColumn({ name: 'seller_id' })
  seller: UserEntity;

  @ManyToOne(() => GigEntity, (gig) => gig.orders)
  @JoinColumn({ name: 'gig_id' })
  gig: GigEntity;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.order)
  payments: PaymentEntity[];

  @Column()
  totalAmount: number;
}
