import { PackageEntity } from 'src/modules/gig/entities/package.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrderEntity } from './order.entity';
import { BaseEntity } from 'src/modules/base/entities/base.entity';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrderEntity, (order) => order.items, { onDelete: 'CASCADE' })
  order: OrderEntity;

  @ManyToOne(() => PackageEntity)
  package: PackageEntity;

  @Column()
  gigTitle: string; // backup nếu gig bị xoá sau này

  @Column()
  packageTitle: string; // backup nếu package thay đổi

  @Column('int')
  price: number;

  @Column('int')
  quantity: number;

  @Column('json', { nullable: true })
  metadata: any; // info bổ sung nếu cần
}
