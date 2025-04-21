import { BaseEntity } from 'src/modules/base/entities/base.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { AutoMap } from '@automapper/classes';
import { IsOptional, IsUUID } from 'class-validator';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';

@Entity('order_deliveries')
export class OrderDeliveryEntity extends BaseEntity {
  @IsOptional()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AutoMap()
  @IsUUID()
  @Column({
    name: 'order_id',
    type: 'char',
    length: 36,
  })
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.deliverables, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @ManyToOne(() => FreelancerEntity)
  @JoinColumn({ name: 'freelancer_id' })
  @IsOptional()
  freelancer: FreelancerEntity;

  @Column({
    name: 'freelancer_id',
    type: 'char',
    length: 36,
  })
  @IsOptional()
  freelancerId: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  message?: string;

  @AutoMap(() => Object)
  @IsOptional()
  @Column({ type: 'json', nullable: true })
  file: object;
}
