import { AutoMap } from '@automapper/classes';
import { IsOptional, IsUUID } from 'class-validator';
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

@Entity('order_questions')
export class OrderQuestionsEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  id: string;

  @AutoMap()
  @Column({
    name: 'order_id',
    type: 'char',
    length: 36,
  })
  @IsUUID()
  orderId: string;

  @ManyToOne(() => OrderEntity, (order) => order.orderQuestionsAnswers)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  question: any;

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  answer: any;

  @Column({ type: 'json', nullable: true })
  @IsOptional()
  file: any;

  @AutoMap(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @AutoMap(() => Date)
  @DeleteDateColumn()
  deletedAt: Date;
}
