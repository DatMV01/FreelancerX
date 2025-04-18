import { BaseEntity } from 'src/modules/base/entities/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { AutoMap } from '@automapper/classes';
import { IsOptional, IsUUID } from 'class-validator';

@Entity('order_questions_answers')
export class OrderQuestionsAnswersEntity extends BaseEntity {
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

  @Column({ type: 'varchar', length: 500, nullable: true })
  @IsOptional()
  file: string;
}
