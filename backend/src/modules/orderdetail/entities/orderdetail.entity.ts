import { AutoMap } from '@automapper/classes';
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
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap(() => OrderEntity)
  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @AutoMap()
  @Column()
  productName: string;

  @AutoMap()
  @Column()
  quantity: number;

  @AutoMap()
  @Column()
  price: number;
  
  @AutoMap()
  @Column()
  totalAmount: number;
}
