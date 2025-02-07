import { BaseEntity } from 'src/modules/base/entities/base.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('order_details')
export class OrderDetailEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column()
  productName: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  totalAmount: number;
}
