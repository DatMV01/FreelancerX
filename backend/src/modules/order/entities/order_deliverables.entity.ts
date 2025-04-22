import { AutoMap } from '@automapper/classes';
import { IsOptional, IsUUID } from 'class-validator';
import { FreelancerEntity } from 'src/modules/freelancer/entities/freelancer.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('order_deliverables')
export class OrderDeliverablesEntity {
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

  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @AutoMap(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;
}
